import { Hono } from 'hono'
import type { Bindings } from '../index'

export const contactRouter = new Hono<{ Bindings: Bindings }>()

// POST /api/contact - Submit contact form
contactRouter.post('/', async (c) => {
  const { DB } = c.env
  try {
    const body = await c.req.json()

    if (!body.name || !body.email || !body.message) {
      return c.json({ success: false, error: 'Name, email, and message are required' }, 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return c.json({ success: false, error: 'Invalid email address' }, 400)
    }

    await DB.prepare(`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      body.name, body.email, body.phone || null,
      body.subject || 'General Inquiry', body.message
    ).run()

    return c.json({ success: true, message: 'Message sent! We\'ll get back to you shortly.' })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/contact/info - Get contact information
contactRouter.get('/info', async (c) => {
  const { DB } = c.env
  try {
    const result = await DB.prepare(`
      SELECT key, value FROM site_settings 
      WHERE key IN ('contact_phone', 'contact_email', 'business_address', 'site_name', 'site_tagline')
    `).all()
    
    const info: Record<string, string> = {}
    for (const row of (result.results as any[])) {
      info[row.key] = row.value
    }
    return c.json({ success: true, data: info })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})
