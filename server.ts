import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("chudau.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    status TEXT,
    priority TEXT,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    icon TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    recordId INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT
  );

  CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author TEXT,
    imageUrl TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed categories if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const insert = db.prepare("INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)");
  insert.run("Bình Tỳ Bà", "pottery", "#28A745");
  insert.run("Bình Thố", "box", "#1E3A8A");
  insert.run("Đĩa Cổ", "disc", "#F59E0B");
  insert.run("Lư Hương", "flame", "#EF4444");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/records", (req, res) => {
    const records = db.prepare("SELECT * FROM records ORDER BY createdAt DESC").all();
    res.json(records);
  });

  app.post("/api/records", (req, res) => {
    const { title, category, status, priority, description } = req.body;
    const info = db.prepare(
      "INSERT INTO records (title, category, status, priority, description) VALUES (?, ?, ?, ?, ?)"
    ).run(title, category, status, priority, description);
    
    db.prepare("INSERT INTO logs (action, recordId, details) VALUES (?, ?, ?)")
      .run("CREATE", info.lastInsertRowid, `Created record: ${title}`);
      
    res.json({ id: info.lastInsertRowid });
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/community", (req, res) => {
    const posts = db.prepare("SELECT * FROM community_posts ORDER BY createdAt DESC").all();
    res.json(posts);
  });

  app.post("/api/community", (req, res) => {
    const { title, content, author, imageUrl } = req.body;
    const info = db.prepare(
      "INSERT INTO community_posts (title, content, author, imageUrl) VALUES (?, ?, ?, ?)"
    ).run(title, content, author, imageUrl);
    res.json({ id: info.lastInsertRowid });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
