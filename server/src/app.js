import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { seedIfNeeded } from './db.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import publicRoutes from './routes/public.js'
import proxyRoutes from './routes/proxy.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())

await seedIfNeeded()

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', publicRoutes)
app.use('/api/proxy', proxyRoutes)

app.get('/', (req, res) => res.json({ ok: true, msg: 'Backend running.' }))

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})