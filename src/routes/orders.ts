import { Hono } from 'hono'
import type { Bindings } from '../index'

export const ordersRouter = new Hono<{ Bindings: Bindings }>()

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `3DP-${ts}-${rand}`
}

// POST /api/orders - Create new order
ordersRouter.post('/', async (c) => {
  const { DB } = c.env
  try {
    const body = await c.req.json()
    const orderNumber = generateOrderNumber()

    // Validate items
    if (!body.items || body.items.length === 0) {
      return c.json({ success: false, error: 'Order must have at least one item' }, 400)
    }

    // Calculate totals
    let subtotal = 0
    const enrichedItems: any[] = []

    for (const item of body.items) {
      if (item.product_id) {
        const product = await DB.prepare(
          `SELECT id, name, sku, price, sale_price, is_available FROM products WHERE id = ?`
        ).bind(item.product_id).first<any>()
        
        if (!product || !product.is_available) {
          return c.json({ success: false, error: `Product ${item.product_id} is not available` }, 400)
        }
        
        const unitPrice = product.sale_price || product.price
        const totalPrice = unitPrice * (item.quantity || 1)
        subtotal += totalPrice
        
        enrichedItems.push({
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          quantity: item.quantity || 1,
          unit_price: unitPrice,
          total_price: totalPrice,
          customization: item.customization || null,
          custom_image_url: item.custom_image_url || null,
          notes: item.notes || null
        })
      } else {
        // Custom item (no product ID)
        const unitPrice = parseFloat(item.unit_price) || 0
        const totalPrice = unitPrice * (item.quantity || 1)
        subtotal += totalPrice
        enrichedItems.push({
          product_id: null,
          product_name: item.product_name || 'Custom Item',
          product_sku: null,
          quantity: item.quantity || 1,
          unit_price: unitPrice,
          total_price: totalPrice,
          customization: item.customization || null,
          custom_image_url: item.custom_image_url || null,
          notes: item.notes || null
        })
      }
    }

    // Get tax rate and shipping cost from settings
    const [taxSetting, shippingSetting, freeShipSetting] = await Promise.all([
      DB.prepare(`SELECT value FROM site_settings WHERE key = 'tax_rate'`).first<{ value: string }>(),
      DB.prepare(`SELECT value FROM site_settings WHERE key = 'base_shipping_cost'`).first<{ value: string }>(),
      DB.prepare(`SELECT value FROM site_settings WHERE key = 'free_shipping_threshold'`).first<{ value: string }>()
    ])

    const taxRate = parseFloat(taxSetting?.value || '0.115')
    const baseShipping = parseFloat(shippingSetting?.value || '8.99')
    const freeShipThreshold = parseFloat(freeShipSetting?.value || '100')

    const shippingCost = subtotal >= freeShipThreshold ? 0 : baseShipping
    const taxAmount = subtotal * taxRate
    const totalAmount = subtotal + shippingCost + taxAmount

    // Find or create customer
    let customerId: number | null = null
    if (body.customer_email) {
      const existingCustomer = await DB.prepare(
        `SELECT id FROM customers WHERE email = ?`
      ).bind(body.customer_email).first<{ id: number }>()

      if (existingCustomer) {
        customerId = existingCustomer.id
      } else {
        const nameParts = (body.customer_name || '').split(' ')
        const newCustomer = await DB.prepare(`
          INSERT INTO customers (email, first_name, last_name, phone)
          VALUES (?, ?, ?, ?)
        `).bind(
          body.customer_email,
          nameParts[0] || '',
          nameParts.slice(1).join(' ') || '',
          body.customer_phone || null
        ).run()
        customerId = newCustomer.meta.last_row_id as number
      }
    }

    // Create the order
    const orderResult = await DB.prepare(`
      INSERT INTO orders (
        order_number, customer_id, customer_email, customer_name, customer_phone,
        status, payment_status, payment_method,
        subtotal, shipping_cost, tax_amount, total_amount,
        shipping_address, billing_address, notes
      ) VALUES (?, ?, ?, ?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderNumber,
      customerId,
      body.customer_email,
      body.customer_name || '',
      body.customer_phone || null,
      body.payment_method || 'paypal',
      subtotal,
      shippingCost,
      taxAmount,
      totalAmount,
      JSON.stringify(body.shipping_address || {}),
      JSON.stringify(body.billing_address || body.shipping_address || {}),
      body.notes || null
    ).run()

    const orderId = orderResult.meta.last_row_id as number

    // Insert order items
    for (const item of enrichedItems) {
      await DB.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_sku,
          quantity, unit_price, total_price, customization, custom_image_url, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId, item.product_id, item.product_name, item.product_sku,
        item.quantity, item.unit_price, item.total_price,
        item.customization ? JSON.stringify(item.customization) : null,
        item.custom_image_url,
        item.notes
      ).run()
    }

    return c.json({
      success: true,
      data: {
        order_id: orderId,
        order_number: orderNumber,
        subtotal,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        items: enrichedItems
      }
    }, 201)
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// POST /api/orders/:id/payment - Update payment status after PayPal
ordersRouter.post('/:id/payment', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  try {
    const body = await c.req.json()
    
    await DB.prepare(`
      UPDATE orders SET
        payment_status = 'paid',
        status = 'confirmed',
        paypal_order_id = ?,
        paypal_payment_id = ?,
        paypal_payer_id = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      body.paypal_order_id || null,
      body.paypal_payment_id || null,
      body.paypal_payer_id || null,
      id
    ).run()

    // Update customer stats
    const order = await DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(id).first<any>()
    if (order?.customer_id) {
      await DB.prepare(`
        UPDATE customers SET 
          total_orders = total_orders + 1,
          total_spent = total_spent + ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(order.total_amount, order.customer_id).run()
    }

    return c.json({ success: true, message: 'Payment confirmed' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/orders/:orderNumber/track - Track order by order number
ordersRouter.get('/:orderNumber/track', async (c) => {
  const { DB } = c.env
  const orderNumber = c.req.param('orderNumber')
  try {
    const order = await DB.prepare(`
      SELECT o.id, o.order_number, o.status, o.payment_status, o.total_amount,
             o.created_at, o.estimated_completion, o.shipped_at
      FROM orders o
      WHERE o.order_number = ?
    `).bind(orderNumber).first()

    if (!order) {
      return c.json({ success: false, error: 'Order not found' }, 404)
    }

    const items = await DB.prepare(`
      SELECT product_name, quantity, unit_price, total_price FROM order_items WHERE order_id = ?
    `).bind((order as any).id).all()

    return c.json({ success: true, data: { ...order, items: items.results } })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/orders - Admin: list all orders
ordersRouter.get('/', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || adminPin !== settings.value) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const url = new URL(c.req.url)
  const status = url.searchParams.get('status')
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  let query = `SELECT * FROM orders WHERE 1=1`
  const params: any[] = []
  if (status) { query += ` AND status = ?`; params.push(status) }
  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
  params.push(limit, offset)

  try {
    const result = await DB.prepare(query).bind(...params).all()
    return c.json({ success: true, data: result.results })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// PUT /api/orders/:id/status - Admin: update order status
ordersRouter.put('/:id/status', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || adminPin !== settings.value) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  try {
    const { status, internal_notes } = await c.req.json()
    await DB.prepare(`
      UPDATE orders SET status = ?, internal_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(status, internal_notes || null, id).run()
    return c.json({ success: true, message: 'Order status updated' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})
