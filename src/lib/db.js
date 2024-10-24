import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../../subscribers.db'), { verbose: console.log });

export function addSubscriber(email) {
  const stmt = db.prepare('INSERT INTO subscribers (email, created_at, confirmation_token) VALUES (?, ?, ?)');
  const now = new Date().toISOString();
  const token = crypto.randomBytes(32).toString('hex');
  
  try {
    stmt.run(email, now, token);
    return { success: true, token };
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return { success: false, error: 'Email already exists' };
    }
    throw error;
  }
}

export function confirmSubscriber(token) {
  const stmt = db.prepare('UPDATE subscribers SET confirmed = 1, confirmation_token = NULL WHERE confirmation_token = ?');
  const result = stmt.run(token);
  return result.changes > 0;
}

export function getSubscriberStats() {
  return {
    total: db.prepare('SELECT COUNT(*) as count FROM subscribers').get().count,
    confirmed: db.prepare('SELECT COUNT(*) as count FROM subscribers WHERE confirmed = 1').get().count,
    unsubscribed: db.prepare('SELECT COUNT(*) as count FROM subscribers WHERE unsubscribed = 1').get().count,
    lastWeek: db.prepare("SELECT COUNT(*) as count FROM subscribers WHERE created_at > datetime('now', '-7 days')").get().count
  };
}

export function getAllSubscribers() {
  const stmt = db.prepare('SELECT * FROM subscribers WHERE confirmed = 1 AND unsubscribed = 0');
  return stmt.all();
}

export function getSubscriberByToken(token) {
  return db.prepare('SELECT * FROM subscribers WHERE confirmation_token = ?').get(token);
}

export function removeSubscriber(email) {
  const stmt = db.prepare('UPDATE subscribers SET unsubscribed = 1 WHERE email = ?');
  const result = stmt.run(email);
  return result.changes > 0;
}

export function trackEmailOpen(subscriberId, newsletterId) {
  const stmt = db.prepare('INSERT INTO email_opens (subscriber_id, newsletter_id, opened_at) VALUES (?, ?, ?)');
  const now = new Date().toISOString();
  stmt.run(subscriberId, newsletterId, now);
}

export function getEmailStats(newsletterId) {
  return {
    opens: db.prepare('SELECT COUNT(DISTINCT subscriber_id) as count FROM email_opens WHERE newsletter_id = ?').get(newsletterId).count,
    totalSent: db.prepare('SELECT COUNT(*) as count FROM subscribers WHERE confirmed = 1 AND unsubscribed = 0').get().count
  };
}
