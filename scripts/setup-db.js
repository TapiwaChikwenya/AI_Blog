import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../subscribers.db'));


// Create subscribers table
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL,
    confirmed BOOLEAN DEFAULT 0,
    confirmation_token TEXT,
    unsubscribed BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS newsletters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    sent_at TEXT NOT NULL,
    template_id TEXT
  );

  CREATE TABLE IF NOT EXISTS email_opens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscriber_id INTEGER NOT NULL,
    newsletter_id INTEGER NOT NULL,
    opened_at TEXT NOT NULL,
    FOREIGN KEY (subscriber_id) REFERENCES subscribers (id),
    FOREIGN KEY (newsletter_id) REFERENCES newsletters (id)
  );

  CREATE TABLE IF NOT EXISTS newsletter_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
    CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Insert default admin user (username: admin, password: adminpass123)
  INSERT OR IGNORE INTO admin_users (username, password_hash)
  VALUES ('admin', '$2b$10$X7GNxTcLfUy6K9FJPVsZgODDdC4jO2.7kK9tIZK9zB9tTUwq5kKfG');

  -- Insert default template
  INSERT OR IGNORE INTO newsletter_templates (id, name, content, created_at)
  VALUES (1, 'Default Template', '
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px; background: linear-gradient(to right, #6366f1, #8b5cf6); color: white; }
          .content { padding: 20px; background: white; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>{{subject}}</h1>
          </div>
          <div class="content">
            {{content}}
          </div>
          <div class="footer">
            <p>You received this email because you subscribed to AI News Weekly.</p>
            <p><a href="{{unsubscribeUrl}}">Unsubscribe</a></p>
          </div>
        </div>
      </body>
    </html>
  ', datetime('now'));
`);

// Create admin users table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Insert default admin user (username: admin, password: adminpass123)
  INSERT OR IGNORE INTO admin_users (username, password_hash)
  VALUES ('admin', '$2b$10$X7GNxTcLfUy6K9FJPVsZgODDdC4jO2.7kK9tIZK9zB9tTUwq5kKfG');
`);

console.log('Database setup completed');
