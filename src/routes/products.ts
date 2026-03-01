import { Hono } from 'hono'
import type { Bindings } from '../index'

export const productsRouter = new Hono<{ Bindings: Bindings }>()

// GET /api/products - List all products with filtering
productsRouter.get('/', async (c) => {
  const { DB } = c.env
  const url = new URL(c.req.url)
  const category = url.searchParams.get('category')
  const featured = url.searchParams.get('featured')
  const search = url.searchParams.get('search')
  const material = url.searchParams.get('material')
  const available = url.searchParams.get('available')
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '12')
  const offset = (page - 1) * limit

  let query = `
    SELECT p.*, 
           cat.name as category_name, cat.slug as category_slug,
           pi.url as primary_image
    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.id
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
    WHERE 1=1
  `
  const params: any[] = []

  if (available !== 'all') {
    query += ` AND p.is_available = 1`
  }
  if (category) {
    query += ` AND cat.slug = ?`
    params.push(category)
  }
  if (featured === '1') {
    query += ` AND p.is_featured = 1`
  }
  if (material) {
    query += ` AND p.material = ?`
    params.push(material)
  }
  if (search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  query += ` ORDER BY p.sort_order ASC, p.is_featured DESC, p.created_at DESC`
  query += ` LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const countQuery = query.replace(/SELECT.*?FROM/, 'SELECT COUNT(*) as total FROM').replace(/ORDER BY.*$/, '')

  try {
    const [results, countResult] = await Promise.all([
      DB.prepare(query).bind(...params).all(),
      DB.prepare(countQuery.replace(` LIMIT ? OFFSET ?`, '')).bind(...params.slice(0, -2)).first<{ total: number }>()
    ])

    return c.json({
      success: true,
      data: results.results,
      pagination: {
        page,
        limit,
        total: countResult?.total || 0,
        pages: Math.ceil((countResult?.total || 0) / limit)
      }
    })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/products/categories - Get all categories
productsRouter.get('/categories', async (c) => {
  const { DB } = c.env
  try {
    const result = await DB.prepare(`
      SELECT cat.*, COUNT(p.id) as product_count 
      FROM categories cat
      LEFT JOIN products p ON cat.id = p.category_id AND p.is_available = 1
      GROUP BY cat.id
      ORDER BY cat.sort_order ASC
    `).all()
    return c.json({ success: true, data: result.results })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/products/materials - Get all materials
productsRouter.get('/materials', async (c) => {
  const { DB } = c.env
  try {
    const result = await DB.prepare(`SELECT * FROM materials WHERE is_active = 1 ORDER BY sort_order ASC`).all()
    return c.json({ success: true, data: result.results })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/products/:slug - Get single product by slug
productsRouter.get('/:slug', async (c) => {
  const { DB } = c.env
  const slug = c.req.param('slug')
  try {
    const product = await DB.prepare(`
      SELECT p.*, 
             cat.name as category_name, cat.slug as category_slug
      FROM products p
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE p.slug = ?
    `).bind(slug).first()

    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404)
    }

    const images = await DB.prepare(`
      SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC
    `).bind((product as any).id).all()

    return c.json({ success: true, data: { ...product, images: images.results } })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// POST /api/products - Create product (admin)
productsRouter.post('/', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || adminPin !== settings.value) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const body = await c.req.json()
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const result = await DB.prepare(`
      INSERT INTO products (name, slug, description, short_description, category_id, material, color, price, sale_price, sku, stock_quantity, is_available, is_featured, is_customizable, weight_grams, dimensions_mm, print_time_hours, lead_time_days, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.name, slug, body.description || '', body.short_description || '',
      body.category_id || null, body.material || 'PLA', body.color || 'White',
      parseFloat(body.price) || 0, body.sale_price ? parseFloat(body.sale_price) : null,
      body.sku || null, body.stock_quantity ?? -1,
      body.is_available ?? 1, body.is_featured ?? 0, body.is_customizable ?? 0,
      body.weight_grams || null, body.dimensions_mm || null,
      body.print_time_hours || null, body.lead_time_days || 3, body.tags || ''
    ).run()

    const productId = result.meta.last_row_id

    // Add images if provided
    if (body.images && body.images.length > 0) {
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i]
        await DB.prepare(`
          INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
          VALUES (?, ?, ?, ?, ?)
        `).bind(productId, img.url, img.alt_text || body.name, i === 0 ? 1 : 0, i).run()
      }
    }

    return c.json({ success: true, data: { id: productId, slug } }, 201)
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// PUT /api/products/:id - Update product (admin)
productsRouter.put('/:id', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || adminPin !== settings.value) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  try {
    const body = await c.req.json()
    await DB.prepare(`
      UPDATE products SET
        name = ?, description = ?, short_description = ?, category_id = ?,
        material = ?, color = ?, price = ?, sale_price = ?, sku = ?,
        stock_quantity = ?, is_available = ?, is_featured = ?, is_customizable = ?,
        weight_grams = ?, dimensions_mm = ?, print_time_hours = ?,
        lead_time_days = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      body.name, body.description || '', body.short_description || '',
      body.category_id || null, body.material || 'PLA', body.color || 'White',
      parseFloat(body.price) || 0, body.sale_price ? parseFloat(body.sale_price) : null,
      body.sku || null, body.stock_quantity ?? -1,
      body.is_available ?? 1, body.is_featured ?? 0, body.is_customizable ?? 0,
      body.weight_grams || null, body.dimensions_mm || null,
      body.print_time_hours || null, body.lead_time_days || 3, body.tags || '', id
    ).run()

    // Update images if provided
    if (body.images) {
      await DB.prepare(`DELETE FROM product_images WHERE product_id = ?`).bind(id).run()
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i]
        await DB.prepare(`
          INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
          VALUES (?, ?, ?, ?, ?)
        `).bind(id, img.url, img.alt_text || body.name, i === 0 ? 1 : 0, i).run()
      }
    }

    return c.json({ success: true, message: 'Product updated' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// DELETE /api/products/:id - Delete product (admin)
productsRouter.delete('/:id', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || adminPin !== settings.value) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  try {
    await DB.prepare(`DELETE FROM products WHERE id = ?`).bind(id).run()
    return c.json({ success: true, message: 'Product deleted' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})
