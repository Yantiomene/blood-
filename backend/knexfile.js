module.exports = {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'blooduser',
      password: 'bloodpwd',
      database: 'blooddb',
    },
    searchPath: ['knex', 'public'],
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  };
  