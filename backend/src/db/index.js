const { Pool } = require('pg');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = require('../constants');
const pool = new Pool({
    user: DB_USER || 'blooduser',
    host: DB_HOST || 'localhost',
    database: DB_NAME || 'blooddb',
    password: DB_PASSWORD || 'bloodpwd',
    port: DB_PORT || 5432
})

module.exports = {
    query: (text, params) => pool.query(text, params),
    close: () => pool.end()
}