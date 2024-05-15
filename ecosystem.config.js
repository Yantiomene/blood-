const { cwd } = require("process");

module.exports = {
    apps: [
      {
        name: 'backend',
        cwd: './backend/',
        script: 'yarn',
        args: 'run dev',
        watch: true,
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        }
      },
      {
        name: 'frontend',
        cwd: './frontend/',
        script: 'npm',
        args: 'start',
        watch: true,
        env: {
          // environment variables
        }
      },
      {
        name: 'redis cache',
        cwd: './backend/',
        script: 'redis-server',
        watch: true,
      }
    ]
  };
  