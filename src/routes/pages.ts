import { Hono } from 'hono'
import type { Bindings } from '../index'
import { getLayout } from '../templates/layout'
import { getHomePage } from '../templates/home'
import { getProductsPage } from '../templates/products'
import { getProductDetailPage } from '../templates/product-detail'
import { getContactPage } from '../templates/contact'
import { getPreviewPage } from '../templates/preview'
import { getCheckoutPage } from '../templates/checkout'
import { getOrderSuccessPage } from '../templates/order-success'
import { getAdminPage } from '../templates/admin'

export const pagesRouter = new Hono<{ Bindings: Bindings }>()

pagesRouter.get('/', async (c) => {
  const { DB } = c.env
  const [featuredResult, categoriesResult, keychainsResult, settings] = await Promise.all([
    DB.prepare(`
      SELECT p.*, pi.url as primary_image, cat.name as category_name
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE p.is_featured = 1 AND p.is_available = 1
      ORDER BY p.sort_order ASC LIMIT 8
    `).all(),
    DB.prepare(`SELECT * FROM categories ORDER BY sort_order ASC LIMIT 8`).all(),
    DB.prepare(`
      SELECT p.*, pi.url as primary_image
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      LEFT JOIN categories cat ON p.category_id = cat.id
      WHERE cat.slug = 'keychains' AND p.is_available = 1
      ORDER BY p.id ASC LIMIT 4
    `).all(),
    DB.prepare(`SELECT key, value FROM site_settings`).all()
  ])

  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value

  return c.html(getLayout(getHomePage(featuredResult.results as any[], categoriesResult.results as any[], settingsMap, keychainsResult.results as any[]), 'Home', settingsMap))
})

pagesRouter.get('/products', async (c) => {
  const { DB } = c.env
  const url = new URL(c.req.url)
  const category = url.searchParams.get('category') || ''
  const search = url.searchParams.get('search') || ''
  const material = url.searchParams.get('material') || ''

  let query = `
    SELECT p.*, pi.url as primary_image, cat.name as category_name, cat.slug as category_slug
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE p.is_available = 1
  `
  const params: any[] = []
  if (category) { query += ` AND cat.slug = ?`; params.push(category) }
  if (material) { query += ` AND p.material = ?`; params.push(material) }
  if (search) { query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`; params.push(`%${search}%`, `%${search}%`, `%${search}%`) }
  query += ` ORDER BY p.is_featured DESC, p.sort_order ASC`

  const [productsResult, categoriesResult, materialsResult, settings] = await Promise.all([
    DB.prepare(query).bind(...params).all(),
    DB.prepare(`SELECT * FROM categories ORDER BY sort_order ASC`).all(),
    DB.prepare(`SELECT * FROM materials WHERE is_active = 1 ORDER BY sort_order ASC`).all(),
    DB.prepare(`SELECT key, value FROM site_settings`).all()
  ])

  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value

  return c.html(getLayout(
    getProductsPage(productsResult.results as any[], categoriesResult.results as any[], materialsResult.results as any[], { category, search, material }),
    'Products', settingsMap
  ))
})

pagesRouter.get('/products/:slug', async (c) => {
  const { DB } = c.env
  const slug = c.req.param('slug')

  const product = await DB.prepare(`
    SELECT p.*, cat.name as category_name, cat.slug as category_slug
    FROM products p LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE p.slug = ?
  `).bind(slug).first()

  if (!product) {
    return c.html(getLayout('<div class="container mx-auto px-4 py-20 text-center"><h1 class="text-3xl font-bold text-gray-800">Product Not Found</h1><p class="mt-4 text-gray-600">The product you\'re looking for doesn\'t exist.</p><a href="/products" class="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg">Browse Products</a></div>', '404', {}), 404)
  }

  const [images, related, settings] = await Promise.all([
    DB.prepare(`SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC`).bind((product as any).id).all(),
    DB.prepare(`
      SELECT p.*, pi.url as primary_image FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.category_id = ? AND p.id != ? AND p.is_available = 1 LIMIT 4
    `).bind((product as any).category_id, (product as any).id).all(),
    DB.prepare(`SELECT key, value FROM site_settings`).all()
  ])

  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value

  const fullProduct = { ...(product as any), images: images.results }
  return c.html(getLayout(getProductDetailPage(fullProduct, related.results as any[], settingsMap), (product as any).name, settingsMap))
})

pagesRouter.get('/contact', async (c) => {
  const { DB } = c.env
  const settings = await DB.prepare(`SELECT key, value FROM site_settings`).all()
  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value
  return c.html(getLayout(getContactPage(settingsMap), 'Contact Us', settingsMap))
})

pagesRouter.get('/preview', async (c) => {
  const { DB } = c.env
  const settings = await DB.prepare(`SELECT key, value FROM site_settings`).all()
  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value
  return c.html(getLayout(getPreviewPage(settingsMap), '3D Preview Tool', settingsMap))
})

pagesRouter.get('/checkout', async (c) => {
  const { DB } = c.env
  const settings = await DB.prepare(`SELECT key, value FROM site_settings`).all()
  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value
  return c.html(getLayout(getCheckoutPage(settingsMap), 'Checkout', settingsMap))
})

pagesRouter.get('/order-success', async (c) => {
  const { DB } = c.env
  const settings = await DB.prepare(`SELECT key, value FROM site_settings`).all()
  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value
  return c.html(getLayout(getOrderSuccessPage(), 'Order Confirmed', settingsMap))
})

pagesRouter.get('/admin', async (c) => {
  const { DB } = c.env
  const settings = await DB.prepare(`SELECT key, value FROM site_settings`).all()
  const settingsMap: Record<string, string> = {}
  for (const s of (settings.results as any[])) settingsMap[s.key] = s.value
  return c.html(getLayout(getAdminPage(), 'Admin Panel', settingsMap))
})
