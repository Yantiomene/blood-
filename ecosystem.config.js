const { cwd } = require("process");

module.exports = {
    apps: [
      {
        name: 'backend',
        script: 'yarn',
        args: 'run dev',
        cwd: './backend/',
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
        script: 'npm',
        args: 'start',
        cwd: './frontend/',
        watch: true,
        env: {
          // environment variables
        }
      },
      {
        name: 'redis cache',
        script: 'redis-server',
        cwd: './backend/',
        watch: true,
      }
    ]
  };
  