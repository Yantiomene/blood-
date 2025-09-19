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
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);

    // Seed baseline user matching seed file
    const bcrypt = require('bcryptjs');
    const hashed = bcrypt.hashSync('password', 10);
    await pool.query(
      `INSERT INTO users (username, email, password, "bloodType", location, "contactNumber", "isDonor", "isHospital", "isBloodBank", "isBloodCamp", "associatedEntityId", "isVerified")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (email) DO NOTHING`,
      ['john_doe', 'john@example.com', hashed, 'A+', null, '123456789', true, false, false, false, null, true]
    );
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