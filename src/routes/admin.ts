import { Hono } from 'hono'
import type { Bindings } from '../index'

export const adminRouter = new Hono<{ Bindings: Bindings }>()

function checkAdmin(pin: string | undefined, correctPin: string): boolean {
  return pin === correctPin
}

// POST /api/admin/login - Verify admin PIN
adminRouter.post('/login', async (c) => {
  const { DB } = c.env
  try {
    const { pin } = await c.req.json()
    const setting = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
    if (setting && pin === setting.value) {
      return c.json({ success: true, token: setting.value })
    }
    return c.json({ success: false, error: 'Invalid PIN' }, 401)
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/admin/dashboard - Dashboard stats
adminRouter.get('/dashboard', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || !checkAdmin(adminPin, settings.value)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const [
      totalProducts, totalOrders, pendingOrders, totalRevenue,
      totalCustomers, recentOrders, lowStock, featured
    ] = await Promise.all([
      DB.prepare(`SELECT COUNT(*) as count FROM products WHERE is_available = 1`).first<{ count: number }>(),
      DB.prepare(`SELECT COUNT(*) as count FROM orders`).first<{ count: number }>(),
      DB.prepare(`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`).first<{ count: number }>(),
      DB.prepare(`SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'paid'`).first<{ total: number }>(),
      DB.prepare(`SELECT COUNT(*) as count FROM customers`).first<{ count: number }>(),
      DB.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 5`).all(),
      DB.prepare(`SELECT COUNT(*) as count FROM products WHERE stock_quantity >= 0 AND stock_quantity < 5`).first<{ count: number }>(),
      DB.prepare(`SELECT COUNT(*) as count FROM products WHERE is_featured = 1`).first<{ count: number }>()
    ])

    return c.json({
      success: true,
      data: {
        stats: {
          total_products: totalProducts?.count || 0,
          total_orders: totalOrders?.count || 0,
          pending_orders: pendingOrders?.count || 0,
          total_revenue: totalRevenue?.total || 0,
          total_customers: totalCustomers?.count || 0,
          featured_products: featured?.count || 0,
          low_stock_products: lowStock?.count || 0
        },
        recent_orders: recentOrders.results
      }
    })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/admin/settings - Get site settings
adminRouter.get('/settings', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || !checkAdmin(adminPin, settings.value)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const allSettings = await DB.prepare(`SELECT * FROM site_settings ORDER BY key`).all()
    const settingsMap: Record<string, string> = {}
    for (const s of (allSettings.results as any[])) {
      settingsMap[s.key] = s.value
    }
    return c.json({ success: true, data: settingsMap })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// PUT /api/admin/settings - Update site settings
adminRouter.put('/settings', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || !checkAdmin(adminPin, settings.value)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const body = await c.req.json()
    for (const [key, value] of Object.entries(body)) {
      await DB.prepare(`
        INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `).bind(key, value as string).run()
    }
    return c.json({ success: true, message: 'Settings updated' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/admin/customers - List customers
adminRouter.get('/customers', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || !checkAdmin(adminPin, settings.value)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const result = await DB.prepare(`SELECT * FROM customers ORDER BY total_spent DESC`).all()
    return c.json({ success: true, data: result.results })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/admin/contacts - List contact messages
adminRouter.get('/contacts', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || !checkAdmin(adminPin, settings.value)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  try {
    const result = await DB.prepare(`SELECT * FROM contact_messages ORDER BY created_at DESC`).all()
    return c.json({ success: true, data: result.results })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// PUT /api/admin/contacts/:id - Mark contact message status
adminRouter.put('/contacts/:id', async (c) => {
  const { DB } = c.env
  const adminPin = c.req.header('X-Admin-Pin')
  const settings = await DB.prepare(`SELECT value FROM site_settings WHERE key = 'admin_pin'`).first<{ value: string }>()
  if (!settings || !checkAdmin(adminPin, settings.value)) {
    return c.json({ success: false, error: 'Unauthorized' }, 401)
  }

  const id = c.req.param('id')
  try {
    const { status } = await c.req.json()
    await DB.prepare(`UPDATE contact_messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(status, id).run()
    return c.json({ success: true })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// POST /api/admin/init - Initialize database tables and seed data
adminRouter.post('/init', async (c) => {
  const { DB } = c.env
  try {
    // Create all tables
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
        description TEXT, icon TEXT DEFAULT 'cube', sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
        description TEXT, short_description TEXT,
        category_id INTEGER, material TEXT NOT NULL DEFAULT 'PLA',
        color TEXT DEFAULT 'White', price REAL NOT NULL DEFAULT 0.00,
        sale_price REAL, sku TEXT UNIQUE,
        stock_quantity INTEGER DEFAULT -1,
        is_available INTEGER DEFAULT 1, is_featured INTEGER DEFAULT 0,
        is_customizable INTEGER DEFAULT 0,
        weight_grams REAL, dimensions_mm TEXT,
        print_time_hours REAL, lead_time_days INTEGER DEFAULT 3,
        tags TEXT, meta_title TEXT, meta_description TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL, url TEXT NOT NULL,
        alt_text TEXT, is_primary INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE, code TEXT UNIQUE,
        description TEXT, properties TEXT,
        color_options TEXT, price_modifier REAL DEFAULT 1.0,
        is_active INTEGER DEFAULT 1, sort_order INTEGER DEFAULT 0
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE, first_name TEXT, last_name TEXT,
        phone TEXT, company TEXT, address_line1 TEXT, address_line2 TEXT,
        city TEXT, state TEXT, zip_code TEXT, country TEXT DEFAULT 'US',
        notes TEXT, total_orders INTEGER DEFAULT 0, total_spent REAL DEFAULT 0.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        customer_id INTEGER, customer_email TEXT NOT NULL,
        customer_name TEXT, customer_phone TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_status TEXT NOT NULL DEFAULT 'unpaid',
        payment_method TEXT DEFAULT 'paypal',
        paypal_order_id TEXT, paypal_payment_id TEXT, paypal_payer_id TEXT,
        subtotal REAL NOT NULL DEFAULT 0.00, shipping_cost REAL DEFAULT 0.00,
        tax_amount REAL DEFAULT 0.00, discount_amount REAL DEFAULT 0.00,
        total_amount REAL NOT NULL DEFAULT 0.00, currency TEXT DEFAULT 'USD',
        shipping_address TEXT, billing_address TEXT,
        notes TEXT, internal_notes TEXT,
        estimated_completion DATETIME, shipped_at DATETIME,
        delivered_at DATETIME, cancelled_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL, product_id INTEGER,
        product_name TEXT NOT NULL, product_sku TEXT,
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price REAL NOT NULL, total_price REAL NOT NULL,
        customization TEXT, custom_image_url TEXT, notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS preview_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT, customer_email TEXT,
        uploaded_image_url TEXT NOT NULL,
        style TEXT DEFAULT 'standard', material TEXT DEFAULT 'PLA',
        color TEXT DEFAULT 'White', notes TEXT,
        preview_image_url TEXT, status TEXT DEFAULT 'pending',
        converted_to_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, email TEXT NOT NULL,
        phone TEXT, subject TEXT, message TEXT NOT NULL,
        status TEXT DEFAULT 'new', ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE, email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL, role TEXT DEFAULT 'admin',
        is_active INTEGER DEFAULT 1, last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE, value TEXT,
        type TEXT DEFAULT 'text', description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run()

    // Seed categories
    const categories = [
      ['Home & Decor', 'home-decor', 'Decorative items for your home', 'home', 1],
      ['Functional Parts', 'functional-parts', 'Practical parts and adapters', 'wrench', 2],
      ['Miniatures & Figurines', 'miniatures', 'Detailed miniatures and collectibles', 'star', 3],
      ['Jewelry & Accessories', 'jewelry', 'Custom jewelry and accessories', 'gem', 4],
      ['Custom Orders', 'custom-orders', 'Fully customized prints', 'magic', 5],
      ['Prototypes', 'prototypes', 'Rapid prototyping', 'flask', 6],
    ]
    for (const [name, slug, desc, icon, order] of categories) {
      await DB.prepare(`INSERT OR IGNORE INTO categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)`)
        .bind(name, slug, desc, icon, order).run()
    }

    // Seed materials
    const materials = [
      ['PLA', 'PLA', 'Polylactic Acid – eco-friendly, great for decorative items', 'White,Black,Red,Blue,Green,Yellow,Gray,Silver,Gold', 1.0, 1],
      ['ABS', 'ABS', 'Strong and durable, ideal for functional parts', 'White,Black,Red,Blue,Gray', 1.2, 2],
      ['PETG', 'PETG', 'Flexible yet strong, food-safe options', 'Clear,White,Black,Blue', 1.3, 3],
      ['TPU', 'TPU', 'Flexible rubber-like material', 'Black,White,Red', 1.5, 4],
      ['Resin', 'RESIN', 'Ultra fine details for miniatures', 'Clear,White,Gray,Black', 2.0, 5],
      ['Nylon', 'NYLON', 'Industrial strength, wear resistant', 'White,Black,Gray', 1.8, 6],
    ]
    for (const [name, code, desc, colors, mod, order] of materials) {
      await DB.prepare(`INSERT OR IGNORE INTO materials (name, code, description, color_options, price_modifier, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
        .bind(name, code, desc, colors, mod, order).run()
    }

    // Seed settings
    const settingsList = [
      ['site_name', '3D Creations PR'],
      ['site_tagline', 'Bringing Your Ideas to Life'],
      ['contact_phone', '787-403-1552'],
      ['contact_email', 'carlos.perez@dataurea.com'],
      ['business_address', 'Puerto Rico, USA'],
      ['paypal_client_id', ''],
      ['currency', 'USD'],
      ['tax_rate', '0.115'],
      ['free_shipping_threshold', '100'],
      ['base_shipping_cost', '8.99'],
      ['lead_time_days', '3'],
      ['about_text', 'We are a Puerto Rico-based 3D printing studio specializing in custom, high-quality prints for homes, businesses, and creatives.'],
      ['hero_title', 'Custom 3D Printing Services'],
      ['hero_subtitle', 'From concept to reality — we print your ideas with precision, quality, and speed.'],
      ['admin_pin', '1234'],
    ]
    for (const [key, value] of settingsList) {
      await DB.prepare(`INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)`).bind(key, value).run()
    }

    // Seed products
    const productData = [
      {
        name: 'Custom Name Plate', slug: 'custom-name-plate',
        short_desc: 'Personalized wall nameplate with your name or message',
        desc: 'Create a beautiful personalized nameplate for your home, office, or as a gift. Choose your text, font style, and finish. Perfect for doors, desks, or wall mounting.',
        cat: 1, material: 'PLA', color: 'White', price: 24.99, featured: 1, custom: 1,
        weight: 45, dims: '{"x":150,"y":50,"z":10}', hours: 2.5, days: 3,
        tags: 'nameplate,personalized,home,decor,gift'
      },
      {
        name: 'Geometric Plant Pot', slug: 'geometric-plant-pot',
        short_desc: 'Modern geometric design pot for small plants and succulents',
        desc: 'Add a modern touch to your living space with our geometric plant pot. Features a contemporary hexagonal design that works perfectly with succulents and cacti.',
        cat: 1, material: 'PLA', color: 'White', price: 18.99, featured: 1, custom: 1,
        weight: 120, dims: '{"x":100,"y":100,"z":90}', hours: 5, days: 3,
        tags: 'plant pot,geometric,home,succulents'
      },
      {
        name: 'Custom Phone Stand', slug: 'custom-phone-stand',
        short_desc: 'Adjustable phone/tablet stand for desk use',
        desc: 'A sturdy, adjustable phone stand that keeps your device at the perfect viewing angle. Compatible with all phone sizes. Features cable management slot.',
        cat: 2, material: 'PETG', color: 'Black', price: 14.99, featured: 1, custom: 0,
        weight: 80, dims: '{"x":120,"y":80,"z":100}', hours: 4, days: 3,
        tags: 'phone stand,desk,tablet,accessories'
      },
      {
        name: 'Dragon Miniature Figure', slug: 'dragon-miniature',
        short_desc: 'Highly detailed dragon miniature for tabletop gaming',
        desc: 'An incredibly detailed dragon miniature perfect for tabletop RPGs, display, or collecting. Printed in high-resolution resin for maximum detail.',
        cat: 3, material: 'Resin', color: 'Gray', price: 34.99, featured: 1, custom: 1,
        weight: 35, dims: '{"x":80,"y":60,"z":70}', hours: 6, days: 5,
        tags: 'miniature,dragon,tabletop,RPG,DnD'
      },
      {
        name: 'Custom Keychain', slug: 'custom-keychain',
        short_desc: 'Personalized keychain with your name or logo',
        desc: 'A durable and stylish personalized keychain. Can include names, initials, logos, or custom shapes. Key ring included. Perfect for gifts.',
        cat: 4, material: 'PLA', color: 'Black', price: 9.99, featured: 0, custom: 1,
        weight: 15, dims: '{"x":60,"y":30,"z":5}', hours: 1, days: 2,
        tags: 'keychain,personalized,gift,accessories'
      },
      {
        name: 'Wall Art Panel - Topographic', slug: 'wall-art-topographic',
        short_desc: '3D topographic map wall art panel',
        desc: 'Transform any space with a stunning 3D topographic map wall art panel. Choose any location — your city, a mountain, or the ocean floor.',
        cat: 1, material: 'PLA', color: 'White', price: 49.99, featured: 1, custom: 1,
        weight: 200, dims: '{"x":250,"y":250,"z":15}', hours: 12, days: 5,
        tags: 'wall art,topographic,map,home decor'
      },
      {
        name: 'Mechanical Keyboard Keycaps', slug: 'keycaps-set',
        short_desc: 'Custom 3D printed keycap set for mechanical keyboards',
        desc: 'Express yourself with fully custom 3D printed keycaps. Compatible with MX, Cherry, and similar switches. Fully customizable legends and colors.',
        cat: 2, material: 'PLA', color: 'White', price: 39.99, featured: 0, custom: 1,
        weight: 60, dims: '{"x":200,"y":100,"z":10}', hours: 8, days: 5,
        tags: 'keycaps,keyboard,mechanical,gaming'
      },
      {
        name: 'Architectural Scale Model', slug: 'architectural-scale-model',
        short_desc: 'Custom architectural model for presentations',
        desc: 'Professional quality architectural scale models for presentations, real estate, and educational purposes. Printed in sections for large models.',
        cat: 6, material: 'PLA', color: 'White', price: 149.99, featured: 0, custom: 1,
        weight: 350, dims: '{"x":300,"y":300,"z":150}', hours: 24, days: 10,
        tags: 'architecture,model,scale,prototype'
      },
    ]

    for (const p of productData) {
      const result = await DB.prepare(`
        INSERT OR IGNORE INTO products (name, slug, short_description, description, category_id, material, color, price, is_available, is_featured, is_customizable, weight_grams, dimensions_mm, print_time_hours, lead_time_days, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?)
      `).bind(p.name, p.slug, p.short_desc, p.desc, p.cat, p.material, p.color, p.price, p.featured, p.custom, p.weight, p.dims, p.hours, p.days, p.tags).run()

      if (result.meta.last_row_id) {
        const imageKey = p.slug.split('-').slice(0, 2).join('-')
        await DB.prepare(`INSERT OR IGNORE INTO product_images (product_id, url, alt_text, is_primary, sort_order) VALUES (?, ?, ?, 1, 0)`)
          .bind(result.meta.last_row_id, `/static/images/product-${imageKey}.svg`, p.name).run()
      }
    }

    return c.json({ success: true, message: 'Database initialized successfully' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})
