// src/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432', 10),
});

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL successfully!');
    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  }
}

export default pool;
