require('dotenv').config();
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER || 'whatsup';
const password = process.env.DB_PASSWORD || 'whatsup';
const database = process.env.DB_DATABASE || 'carrot_world2';

const config = { host, user, password, database, connectionLimit: 5 };
exports.pool = mysql.createPool(config);
