const Pool = require('pg').Pool;

const pool = new Pool({
    host: "127.0.0.1",
    user: "postgres",
    port: 5432,
    password: "admin",
    database: "db"
});

module.exports = pool;
