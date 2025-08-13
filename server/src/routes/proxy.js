import express from 'express'
import db from '../db.js'
import axios from 'axios'
import { mapVodList } from '../utils/maccmsAdapter.js'

const router = express.Router()

router.get('/vod', async (req, res) => {
  try {
    const ac = req.query.ac || 'list'
    const t = req.query.t
    const pg = req.query.pg
    const wd = req.query.wd
    const sourceId = req.query.sourceId

    // Determine source
    let base_url
    if (sourceId) {
      const src = db.prepare('SELECT base_url FROM sources WHERE id=? AND active=1').get(sourceId)
      if (!src) return res.status(400).json({ code: 400, success: false, message: '无效的视频源' })
      base_url = src.base_url
    } else {
      const settings = db.prepare('SELECT default_source_id FROM settings WHERE id=1').get()
      const src = db.prepare('SELECT base_url FROM sources WHERE id=? AND active=1').get(settings?.default_source_id)
      if (!src) return res.status(400).json({ code: 400, success: false, message: '无效的默认视频源' })
      base_url = src.base_url
    }

    // Build url
    let url = base_url + '?ac=' + encodeURIComponent(ac)
    if (t) url += '&t=' + encodeURIComponent(t)
    if (pg) url += '&pg=' + encodeURIComponent(pg)
    if (wd) url += '&wd=' + encodeURIComponent(wd)
    url += '&format=json'

    const resp = await axios.get(url, { timeout: 15000 })
    if (resp.data && Array.isArray(resp.data.list)) {
      res.json({
        code: 200,
        success: true,
        data: {
          total: resp.data.total || resp.data.pagecount * (resp.data.limit || 20) || resp.data.list.length,
          list: mapVodList(resp.data.list)
        }
      })
    } else {
      res.json({ code: 200, success: true, data: { total: 0, list: [] } })
    }
  } catch (e) {
    res.status(500).json({ code: 500, success: false, message: e.message })
  }
})

export default router