
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_PATH = path.join(__dirname, 'database.json');
  const UPLOAD_DIR = path.join(__dirname, 'image');

  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
  if (!fs.existsSync(DB_PATH)) {
      const initialDB = {
          users: [{ id: 'admin-1', username: 'admin', password: 'admin123', role: 'superadmin' }],
          rsvps: [],
          messages: [],
          config: null
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
  }

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use("/image", express.static(UPLOAD_DIR));

  app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
  });

  const readDB = () => {
      try {
          return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      } catch (e) {
          console.error("DB Read Error:", e);
          return { users: [], rsvps: [], messages: [], config: null };
      }
  };
  const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  const verifyToken = (req, res, next) => {
      req.user = { role: 'superadmin' };
      next();
  };

  app.get('/api/health', (req, res) => res.json({ status: 'ok', server: 'running', port: PORT }));
  app.post('/api/admin/login', (req, res) => res.json({ token: 'mock-jwt-token', user: { username: 'admin', role: 'superadmin' } }));
  
  app.get('/api/admin/stats', verifyToken, (req, res) => {
      try {
          const db = readDB();
          const stats = {
              totalRSVPs: db.rsvps ? db.rsvps.length : 0,
              totalGuests: db.rsvps ? db.rsvps.reduce((acc, curr) => acc + (curr.guestsCount || 0), 0) : 0,
              totalMessages: db.messages ? db.messages.length : 0,
              trafficData: [
                  { name: 'Mon', visits: 400 }, { name: 'Tue', visits: 300 },
                  { name: 'Wed', visits: 600 }, { name: 'Thu', visits: 800 },
                  { name: 'Fri', visits: 500 }, { name: 'Sat', visits: 900 },
                  { name: 'Sun', visits: 1000 }
              ]
          };
          res.json(stats);
      } catch (error) {
          res.status(500).json({ message: "Failed to fetch stats" });
      }
  });

  app.get('/api/admin/rsvps', verifyToken, (req, res) => res.json(readDB().rsvps || []));
  app.delete('/api/admin/rsvps/:id', verifyToken, (req, res) => {
      try {
          const db = readDB();
          db.rsvps = (db.rsvps || []).filter(r => r.id !== req.params.id);
          writeDB(db);
          res.json({ success: true });
      } catch (error) {
          res.status(500).json({ message: "Failed deletion" });
      }
  });

  app.post('/api/public/rsvp', (req, res) => {
      try {
          const db = readDB();
          const newRSVP = { ...req.body, id: Date.now().toString(), createdAt: new Date() };
          if (!db.rsvps) db.rsvps = [];
          db.rsvps.push(newRSVP);
          writeDB(db);
          res.json({ success: true });
      } catch (error) {
          res.status(500).json({ message: "Failed" });
      }
  });

  app.post('/api/public/message', (req, res) => {
      try {
          const db = readDB();
          const newMsg = { ...req.body, id: Date.now().toString(), createdAt: new Date() };
          if (!db.messages) db.messages = [];
          db.messages.push(newMsg);
          writeDB(db);
          res.json({ success: true });
      } catch (error) {
          res.status(500).json({ message: "Failed" });
      }
  });

  app.get('/api/admin/messages', verifyToken, (req, res) => res.json(readDB().messages || []));
  
  app.get('/api/public/config', (req, res) => {
      const db = readDB();
      res.json(db.config);
  });

  app.post('/api/admin/config', verifyToken, (req, res) => {
      try {
          const db = readDB();
          db.config = req.body;
          writeDB(db);
          res.json({ success: true });
      } catch (error) {
          res.status(500).json({ message: "Failed save" });
      }
  });

  const storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'image/'),
      filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
  });
  const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

  app.post('/api/upload', verifyToken, upload.single('image'), (req, res) => {
      if (!req.file) return res.status(400).send('No file uploaded.');
      const baseUrl = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1') ? `http://${req.get('host')}` : `https://${req.get('host')}`;
      res.json({ success: true, imageUrl: `${baseUrl}/image/${req.file.filename}` });
  });

  app.get('/api/admin/media', verifyToken, (req, res) => {
      fs.readdir(UPLOAD_DIR, (err, files) => {
          if (err) return res.status(500).json({ message: 'Error' });
          const baseUrl = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1') ? `http://${req.get('host')}` : `https://${req.get('host')}`;
          const media = files.map(file => {
              try {
                  const stats = fs.statSync(path.join(UPLOAD_DIR, file));
                  return {
                      name: file,
                      url: `${baseUrl}/image/${file}`,
                      type: /\.(mp4|mkv|mov|webm)$/i.test(file) ? 'video' : 'image',
                      size: stats.size,
                      createdAt: stats.birthtime
                  };
              } catch (e) { return null; }
          }).filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
          res.json(media);
      });
  });

  app.delete('/api/admin/media/:filename', verifyToken, (req, res) => {
      const safeFilename = path.basename(req.params.filename);
      const filepath = path.join(UPLOAD_DIR, safeFilename);
      if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          res.json({ success: true });
      } else {
          res.status(404).json({ message: 'File not found' });
      }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    // For React Router
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.use((err, req, res, next) => {
      if (err instanceof multer.MulterError) return res.status(400).json({ message: err.message });
      res.status(500).json({ message: "Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
