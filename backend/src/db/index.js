const { Pool } = require('pg');
const pool = new Pool({
    user: 'blooduser',
    host: 'localhost',
    database: 'blooddb',
    password: 'bloodpwd',
    port: 5432
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}