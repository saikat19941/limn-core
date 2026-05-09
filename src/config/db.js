const mysql = require("mysql2/promise");


// Create Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Test Database Connection
const testConnection = async () => {

    try {

        const connection = await pool.getConnection();

        console.log("MariaDB Connected Successfully");

        connection.release();

    } catch (error) {

        console.error("Database Connection Failed");
        console.error(error);

    }

};


module.exports = {
    pool,
    testConnection
};