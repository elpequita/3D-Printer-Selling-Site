import { Hono } from 'hono'
import type { Bindings } from '../index'

export const previewRouter = new Hono<{ Bindings: Bindings }>()

// POST /api/preview - Submit image for 3D preview
previewRouter.post('/', async (c) => {
  const { DB } = c.env
  try {
    const formData = await c.req.formData()
    const imageFile = formData.get('image') as File | null
    const style = formData.get('style') as string || 'standard'
    const material = formData.get('material') as string || 'PLA'
    const color = formData.get('color') as string || 'White'
    const notes = formData.get('notes') as string || ''
    const email = formData.get('email') as string || ''
    const sessionId = formData.get('session_id') as string || crypto.randomUUID()

    if (!imageFile) {
      return c.json({ success: false, error: 'No image provided' }, 400)
    }

    // Convert to base64 data URL (stored inline for demo)
    const arrayBuffer = await imageFile.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    const base64 = btoa(binary)
    const mimeType = imageFile.type || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Save preview request
    const result = await DB.prepare(`
      INSERT INTO preview_requests (session_id, customer_email, uploaded_image_url, style, material, color, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
    `).bind(sessionId, email, dataUrl, style, material, color, notes).run()

    return c.json({
      success: true,
      data: {
        preview_id: result.meta.last_row_id,
        session_id: sessionId,
        uploaded_image: dataUrl,
        style, material, color,
        message: 'Preview generated successfully'
      }
    })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})

// GET /api/preview/:id - Get preview by ID
previewRouter.get('/:id', async (c) => {
  const { DB } = c.env
  const id = c.req.param('id')
  try {
    const preview = await DB.prepare(`SELECT * FROM preview_requests WHERE id = ?`).bind(id).first()
    if (!preview) {
      return c.json({ success: false, error: 'Preview not found' }, 404)
    }
    return c.json({ success: true, data: preview })
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500)
  }
})
