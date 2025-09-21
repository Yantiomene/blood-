const express = require('express');
const { PORT, CLIENT_URL } = require('./constants');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const { WebSocketServer } = require('ws');
const { handleWebSocketMessages } = require('./controllers/websocketHandlers');
const http = require('http');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const app = express();


// Log incoming requests
app.use((req, res, next) => {
    req.logger = logger;
    req.logger.info(`Request: ${req.method} ${req.url}`);
    next();
});

// Import validations middleware
require('./middlewares/validations-middleware');

// import passport middleware
require('./middlewares/passport-middleware');

// impoort routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogsRoute');
const messageRoutes = require('./routes/messagesRoute');

//initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}))
app.use(helmet());
app.use(passport.initialize());

// initialize routes
app.use('/api', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/api', messageRoutes);


// Log errors
app.use((err, req, res, next) => {
    req.logger.error(err.stack);
    res.status(500).send('Something went wrong!');
});


// Handle not found routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Small bootstrap: seed blogs from SQL dump if empty (skip in tests)
async function bootstrapBlogsSeed() {
  if (process.env.NODE_ENV === 'test') return;
  try {
    // Ensure blogs table exists
    const rel = await db.query('SELECT to_regclass($1) AS rel', ['public.blogs']);
    if (!rel.rows[0] || !rel.rows[0].rel) {
      logger.warn('blogs table does not exist yet; skipping blog seed');
      return;
    }

    const { rows } = await db.query('SELECT COUNT(*)::int AS count FROM blogs');
    const count = rows && rows[0] ? rows[0].count : 0;
    if (count > 0) return; // already seeded

    const dumpPath = path.resolve(__dirname, '..', 'blogs_dump.sql');
    if (!fs.existsSync(dumpPath)) {
      logger.warn(`blogs_dump.sql not found at ${dumpPath}; skipping blog seed`);
      return;
    }

    const sql = fs.readFileSync(dumpPath, 'utf8');
    const lines = sql.split(/\r?\n/);
    const startIdx = lines.findIndex((l) => l.startsWith('COPY public.blogs'));
    if (startIdx === -1) {
      logger.warn('COPY section for blogs not found in blogs_dump.sql; skipping');
      return;
    }

    const dataLines = [];
    for (let i = startIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '\\.') break; // end of COPY data
      if (!line.trim()) continue; // skip empty lines
      dataLines.push(line);
    }

    if (dataLines.length === 0) {
      logger.warn('No blog rows found in blogs_dump.sql; skipping');
      return;
    }

    const insertText = 'INSERT INTO blogs (id, title, content, created_at, updated_at, image) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING';
    for (const line of dataLines) {
      const parts = line.split('\t');
      if (parts.length < 6) continue;
      const [idStr, title, content, created_at, updated_at, image] = parts;
      const id = parseInt(idStr, 10);
      await db.query(insertText, [id, title, content, created_at, updated_at, image || null]);
    }

    // Adjust sequence to max(id) to avoid future conflicts
    await db.query("SELECT setval(pg_get_serial_sequence('blogs','id'), COALESCE((SELECT MAX(id) FROM blogs), 1), true)");

    logger.info(`Seeded ${dataLines.length} blog(s) from blogs_dump.sql`);
  } catch (err) {
    logger.warn(`Blog bootstrap skipped due to error: ${err.message}`);
  }
}


// Create HTTP server using Express app
const server = http.createServer(app);

// Initialize WebSocket server (skip in test env)
let wss = null;
if (process.env.NODE_ENV !== 'test') {
  wss = new WebSocketServer({ server });
  
  wss.on('error', (error) => {
    logger.error('WebSocket Server error:', error);
  });
  
  wss.on('connection', (ws) => {
      logger.info('WebSocket Client connected');
      
      ws.on('error', (error) => {
        logger.error('WebSocket connection error:', error);
      });

      // Handle WebSocket messages
      handleWebSocketMessages(ws);
  });
}

// Start the server (skip in test environment to avoid port conflicts)
if (process.env.NODE_ENV !== 'test') {
  // Trigger non-blocking bootstrap for blogs seed
  bootstrapBlogsSeed().catch((err) => logger.warn(`Blog bootstrap error: ${err.message}`));

  server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
  });
}

// Expose server on app for tests and export app for supertest
app.server = server;
module.exports = app;

/*const appStart = () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });

        app.server = server;
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

appStart();*/
