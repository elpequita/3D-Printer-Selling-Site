import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'
import { productsRouter } from './routes/products'
import { ordersRouter } from './routes/orders'
import { adminRouter } from './routes/admin'
import { previewRouter } from './routes/preview'
import { contactRouter } from './routes/contact'
import { pagesRouter } from './routes/pages'

export type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Admin-Pin'],
}))

// Static files
app.use('/static/*', serveStatic({ root: './' }))
app.get('/favicon.svg', async (c) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1e40af"/>
  <polygon points="50,20 80,37 80,63 50,80 20,63 20,37" fill="#3b82f6"/>
  <polygon points="50,20 80,37 50,50 20,37" fill="#93c5fd"/>
  <polygon points="50,50 80,37 80,63 50,80" fill="#2563eb"/>
  <polygon points="50,50 20,37 20,63 50,80" fill="#1d4ed8"/>
</svg>`
  return c.body(svg, 200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' })
})
app.get('/favicon.ico', (c) => c.redirect('/favicon.svg', 301))

// API Routes
app.route('/api/products', productsRouter)
app.route('/api/orders', ordersRouter)
app.route('/api/admin', adminRouter)
app.route('/api/preview', previewRouter)
app.route('/api/contact', contactRouter)

// Frontend page routes
app.route('/', pagesRouter)

export default app
