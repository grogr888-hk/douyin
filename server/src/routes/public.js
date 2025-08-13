import express from 'express'
import db from '../db.js'
const router = express.Router()

// List active sources
router.get('/sources', (req, res) => {
  const sources = db.prepare('SELECT id, name, base_url FROM sources WHERE active=1').all()
  res.json({ success: true, sources })
})

// Get settings
router.get('/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id=1').get()
  res.json({ success: true, settings })
})

export default router