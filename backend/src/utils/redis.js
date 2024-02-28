const redis = require('redis');

class RedisClient {
  constructor(host, port) {
    this.client = redis.createClient({host, port});
    this.client.on('error', (error) => {
      console.error(`Redis client not connected to the server: ${error}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.client.on('ready', () => {
        console.log('Redis client connected.');
        resolve();
      });
      this.client.on('error', (error) => {
        console.error(`Redis client error: ${error}`);
        reject(error);
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
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient('127.0.0.1', 6379);
module.exports = redisClient;
