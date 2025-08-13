import express from 'express'
import db from '../db.js'
import { auth, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// List users by status
router.get('/users', auth, adminOnly, (req, res) => {
  const status = req.query.status
  if (!['pending', 'approved', 'rejected'].includes(status)) return res.status(400).json({ message: '状态参数错误' })
  const users = db.prepare('SELECT id, username, role, status, created_at FROM users WHERE status=?').all(status)
  res.json({ success: true, users })
})

// Approve/reject user
router.post('/users/:id/approve', auth, adminOnly, (req, res) => {
  const id = req.params.id
  const status = req.body.status ?? 'approved'
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: '状态参数错误' })
  db.prepare('UPDATE users SET status=? WHERE id=?').run(status, id)
  res.json({ success: true, message: `用户${status === 'approved' ? '已通过' : '已拒绝'}` })
})

// List sources
router.get('/sources', auth, adminOnly, (req, res) => {
  const sources = db.prepare('SELECT * FROM sources').all()
  res.json({ success: true, sources })
})

// Add source
router.post('/sources', auth, adminOnly, (req, res) => {
  const { name, base_url, active } = req.body
  if (!name || !base_url) return res.status(400).json({ message: '参数错误' })
  db.prepare('INSERT INTO sources (name, base_url, active) VALUES (?, ?, ?)').run(name, base_url, active ? 1 : 0)
  res.json({ success: true })
})

// Update source
router.put('/sources/:id', auth, adminOnly, (req, res) => {
  const id = req.params.id
  const { name, base_url, active } = req.body
  db.prepare('UPDATE sources SET name=COALESCE(?,name), base_url=COALESCE(?,base_url), active=COALESCE(?,active) WHERE id=?')
    .run(name, base_url, typeof active === 'undefined' ? undefined : (active ? 1 : 0), id)
  res.json({ success: true })
})

// Delete source
router.delete('/sources/:id', auth, adminOnly, (req, res) => {
  const id = req.params.id
  db.prepare('DELETE FROM sources WHERE id=?').run(id)
  res.json({ success: true })
})

// Get settings
router.get('/settings', auth, adminOnly, (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id=1').get()
  res.json({ success: true, settings })
})

// Update settings
router.put('/settings', auth, adminOnly, (req, res) => {
  const { default_source_id, default_category } = req.body
  db.prepare('UPDATE settings SET default_source_id=COALESCE(?,default_source_id), default_category=COALESCE(?,default_category) WHERE id=1')
    .run(default_source_id, default_category)
  res.json({ success: true })
})

export default router