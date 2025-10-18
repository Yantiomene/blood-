const { Pool } = require('pg');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, NODE_ENV } = require('../constants');

let db;

if (NODE_ENV === 'test') {
  // In-memory Postgres using pg-mem
  const { newDb } = require('pg-mem');
  const mem = newDb({ autoCreateForeignKeyIndices: true });

  // Register pg adapter to get a pg-compatible Pool
  const adapter = mem.adapters.createPg();
  const { Pool: MemPool } = adapter;
  const pool = new MemPool();

  // Helper to run bootstrap SQL (migrations subset + seeds minimal)
  const bootstrap = async () => {
    // Minimal schema for tests based on migrations (preserve quoted identifiers)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "bloodType" VARCHAR(3) NOT NULL,
        location POINT NULL,
        "contactNumber" VARCHAR(50),
        "isDonor" BOOLEAN DEFAULT FALSE,
        "isHospital" BOOLEAN DEFAULT FALSE,
        "isBloodBank" BOOLEAN DEFAULT FALSE,
        "isBloodCamp" BOOLEAN DEFAULT FALSE,
        "associatedEntityId" INTEGER NULL,
        "isVerified" BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS donation_requests (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "bloodType" VARCHAR(3) NOT NULL,
        quantity INTEGER NOT NULL,
        location POINT NOT NULL,
        "isFulfilled" BOOLEAN DEFAULT FALSE,
        "requestingEntity" VARCHAR(20) NOT NULL,
        "requestingEntityId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT,
        urgent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        "senderId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "receiverId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        "conversationId" INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
        "senderId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "recipientId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        "messageType" VARCHAR(50) NOT NULL,
        status VARCHAR(50),
        metadata JSONB,
        event JSONB,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      -- Blogs table per migrations (including image column)
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        image VARCHAR(255),
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );

      -- Blog comments
      CREATE TABLE IF NOT EXISTS blog_comments (
        id SERIAL PRIMARY KEY,
        blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES blog_comments(id) ON DELETE CASCADE,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT now()
      );

      -- Track donor acceptances of donation requests
      CREATE TABLE IF NOT EXISTS donation_acceptances (
        id SERIAL PRIMARY KEY,
        "requestId" INTEGER REFERENCES donation_requests(id) ON DELETE CASCADE,
        "donorId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT now()
      );
      -- Ensure a donor can accept a request only once
      CREATE UNIQUE INDEX IF NOT EXISTS donation_acceptances_unique ON donation_acceptances ("requestId", "donorId");
    `);


  };

  // Run bootstrap immediately
  const ready = bootstrap();

  db = {
    query: async (text, params) => {
      await ready; // ensure schema is ready
      return pool.query(text, params);
    },
    close: async () => {
      // pg-mem runs in-process; nothing to close
      return Promise.resolve();
    }
  };
} else {
  const pool = new Pool({
    user: DB_USER || 'blooduser',
    host: DB_HOST || 'localhost',
    database: DB_NAME || 'blooddb',
    password: DB_PASSWORD || 'bloodpwd',
    port: DB_PORT || 5432,
  });

  db = {
    query: (text, params) => pool.query(text, params),
    close: () => pool.end(),
  };
}

module.exports = db;