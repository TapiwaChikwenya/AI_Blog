import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../subscribers.db'), { verbose: console.log });

export function getAdminUser(username) {
  return db.prepare('SELECT username, password_hash FROM admin_users WHERE username = ?').get(username);
}

export function verifyAdminCredentials(username, password) {
  const user = getAdminUser(username);
  console.log('Verifying credentials for user:', username);
  console.log('User found:', user ? 'Yes' : 'No');
  if (!user) return false;
  const isPasswordCorrect = bcrypt.compareSync(password, user.password_hash);
  console.log('Password correct:', isPasswordCorrect ? 'Yes' : 'No');
  return isPasswordCorrect;
}

export function initializeAdminTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `).run();

  const defaultPassword = 'adminpass123';
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  const adminUser = db.prepare('SELECT * FROM admin_users WHERE username = ?').get('admin');
  if (!adminUser) {
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hashedPassword);
    console.log('Default admin user created with password: adminpass123');
  } else {
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(hashedPassword, 'admin');
    console.log('Admin password updated to: adminpass123');
  }
}

export function getAllAdminUsers() {
  return db.prepare('SELECT username FROM admin_users').all();
}

export function changeAdminPassword(username, currentPassword, newPassword) {
  const user = getAdminUser(username);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
    return { success: false, error: 'Current password is incorrect' };
  }

  const newHashedPassword = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(newHashedPassword, username);

  return { success: true, message: 'Password updated successfully' };
}
