const redis = require('redis');

let exportedClient;

if (process.env.NODE_ENV === 'test') {
  class InMemoryRedisClient {
    constructor() {
      this.store = new Map();
    }
    isAlive() {
      return true;
    }
    async connect() {
      return; // no-op
    }
    async get(key) {
      return this.store.get(key) || null;
    }
    async set(key, value, duration) {
      this.store.set(key, value);
      // ignore duration in test
    }
    async del(key) {
      this.store.delete(key);
    }
    async quit() {
      this.store.clear();
    }
  }
  exportedClient = new InMemoryRedisClient();
} else {
  class RedisClient {
    constructor(host, port) {
      this.client = redis.createClient({ host, port });
      this.client.on('error', (error) => {
        console.error(`Redis client not connected to the server: ${error}`);
      });
    }

    isAlive() {
      return this.client.connected;
    }

    async connect() {
      return new Promise((resolve, reject) => {
        const errorHandler = (error) => {
          reject(error);
        };
        this.client.once('error', errorHandler);
        this.client.on('ready', () => {
          this.client.removeListener('error', errorHandler);
          console.log('Redis client connected.');
          resolve();
        });
      });
    }

    async get(key) {
      return new Promise((resolve, reject) => {
        this.client.get(key, (error, value) => {
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        });
      });
    }

    async set(key, value, duration) {
      return new Promise((resolve, reject) => {
        this.client.set(key, value, (err) => {
          if (err) return reject(err);
          if (typeof duration === 'number' && duration > 0) {
            this.client.expire(key, duration, (err2) => {
              if (err2) return reject(err2);
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
    }

    async del(key) {
      return new Promise((resolve, reject) => {
        this.client.del(key, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    async quit() {
      return new Promise((resolve) => {
        // node_redis v2 uses callbacks for quit
        this.client.quit(() => resolve());
      });
    }
  }

  const redisHost = process.env.REDIS_HOST || '127.0.0.1';
  const redisPortVal = process.env.REDIS_PORT || 6379;
  exportedClient = new RedisClient(redisHost, redisPortVal);
}

module.exports = exportedClient;
module.exports.redisClient = exportedClient;
