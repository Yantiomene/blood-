const {config} = require('dotenv');
config();

// Add runtime env validation (only when not running tests)
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV !== 'test') {
  const requiredKeys = [
    'PORT',
    'SERVER_URL',
    'CLIENT_URL',
    'SECRET',
    'EMAIL',
    'PASSWORD',
    'GOOGLE_MAPS_API_KEY',
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
  ];

  const missing = requiredKeys.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
  if (missing.length) {
    // Fail fast on startup with a helpful error
    console.error(`[ENV VALIDATION] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Optional but recommended keys
  const optionalKeys = ['REDIS_HOST', 'REDIS_PORT'];
  const optionalMissing = optionalKeys.filter((k) => !process.env[k] || String(process.env[k]).trim() === '');
  if (optionalMissing.length) {
    console.warn(`[ENV VALIDATION] Optional env variables not set: ${optionalMissing.join(', ')}`);
  }
}

// Provide sensible defaults during tests to keep integration tests hermetic
const TEST_DEFAULTS = NODE_ENV === 'test' ? {
  PORT: process.env.PORT || '0',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost',
  SECRET: process.env.SECRET || 'test_secret',
  DB_USER: process.env.DB_USER || 'test_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'test_password',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '5432',
  DB_NAME: process.env.DB_NAME || 'test_db',
} : {};

module.exports = {
    // server configuration
    PORT: process.env.PORT || TEST_DEFAULTS.PORT,
    SERVER_URL: process.env.SERVER_URL || TEST_DEFAULTS.SERVER_URL,
    CLIENT_URL: process.env.CLIENT_URL || TEST_DEFAULTS.CLIENT_URL,
    SECRET: process.env.SECRET || TEST_DEFAULTS.SECRET,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,

    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,

    // database configuration
    DB_USER: process.env.DB_USER || TEST_DEFAULTS.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD || TEST_DEFAULTS.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST || TEST_DEFAULTS.DB_HOST,
    DB_PORT: process.env.DB_PORT || TEST_DEFAULTS.DB_PORT,
    DB_NAME: process.env.DB_NAME || TEST_DEFAULTS.DB_NAME,

    // cache configuration (optional)
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    NODE_ENV,
}