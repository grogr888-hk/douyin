import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
const dbFile = path.resolve('./server', 'db.sqlite3')
const db = new Database(dbFile)

export default db

// Initialize tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password_hash TEXT,
  role TEXT DEFAULT 'user',
  status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  base_url TEXT,
  active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  default_source_id INTEGER,
  default_category TEXT
);
`)

export async function seedIfNeeded() {
  // Seed admin if not exists
  const admin = db.prepare('SELECT * FROM users WHERE role=?').get('admin')
  if (!admin) {
    const hash = bcrypt.hashSync('admin123', 10)
    db.prepare('INSERT INTO users (username, password_hash, role, status) VALUES (?, ?, ?, ?)')
      .run('admin', hash, 'admin', 'approved')
    console.log('Seeded admin user (admin/admin123)')
  }
  // Seed default source if none
  const source = db.prepare('SELECT * FROM sources').get()
  if (!source) {
    const info = db.prepare('INSERT INTO sources (name, base_url, active) VALUES (?, ?, ?)').run(
      '默认源',
      'https://slapibf.com/api.php/provide/vod/',
      1
    )
    // Seed settings
    db.prepare('INSERT OR IGNORE INTO settings (id, default_source_id, default_category) VALUES (1, ?, NULL)')
      .run(info.lastInsertRowid)
    console.log('Seeded default MACCMS source')
  }
  // Seed settings if not exists
  const settings = db.prepare('SELECT * FROM settings WHERE id=1').get()
  if (!settings) {
    const src = db.prepare('SELECT id FROM sources LIMIT 1').get()
    db.prepare('INSERT INTO settings (id, default_source_id, default_category) VALUES (1, ?, NULL)')
      .run(src ? src.id : 1)
  }
}