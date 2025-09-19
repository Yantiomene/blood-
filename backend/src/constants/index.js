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

module.exports = {
    // server configuration
    PORT: process.env.PORT,
    SERVER_URL: process.env.SERVER_URL,
    CLIENT_URL: process.env.CLIENT_URL,
    SECRET: process.env.SECRET,
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD,

    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,

    // database configuration
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,

    // cache configuration (optional)
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    NODE_ENV,
}