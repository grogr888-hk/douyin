import express from 'express'
import db from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { auth } from '../middleware/auth.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const router = express.Router()

router.post('/register', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: '缺少参数' })
  const exists = db.prepare('SELECT * FROM users WHERE username=?').get(username)
  if (exists) return res.status(409).json({ message: '用户名已存在' })
  const hash = bcrypt.hashSync(password, 10)
  db.prepare('INSERT INTO users (username, password_hash, role, status) VALUES (?, ?, ?, ?)').run(
    username, hash, 'user', 'pending'
  )
  res.json({ success: true, message: '注册成功，等待管理员审核' })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: '缺少参数' })
  const user = db.prepare('SELECT * FROM users WHERE username=?').get(username)
  if (!user) return res.status(404).json({ message: '用户不存在' })
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ message: '密码错误' })
  if (user.status === 'pending') return res.status(403).json({ message: '账号待审核' })
  if (user.status === 'rejected') return res.status(403).json({ message: '账号已被拒绝' })
  const token = jwt.sign({ userId: user.id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '2d' })
  res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role, status: user.status } })
})

router.get('/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, username, role, status, created_at FROM users WHERE id=?').get(req.user.userId)
  if (!user) return res.status(404).json({ message: '用户不存在' })
  res.json({ success: true, user })
})

export default router