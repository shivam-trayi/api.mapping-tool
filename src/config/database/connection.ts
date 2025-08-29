import sql, { ConnectionPool } from 'mssql';
import dotenv from 'dotenv';
dotenv.config(); // Load .env

// Database configuration from .env
const config: sql.config = {
  server: process.env.DB_SERVER || '68.178.207.198',
  user: process.env.DB_USER || 'gswebsurvey',
  password: process.env.DB_PASSWORD || '@TS$GSweb',
  database: process.env.DB_DATABASE || 'staging_gswebsurveys',
  port: Number(process.env.DB_PORT || 1433),
  connectionTimeout: Number(process.env.DB_CONNECTION_TIMEOUT || 60000),
  requestTimeout: Number(process.env.DB_REQUEST_TIMEOUT || 60000),
  pool: {
    min: Number(process.env.DB_MIN_POOL || 1),
    max: Number(process.env.DB_MAX_POOL || 10),
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    enableArithAbort: true,
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
  },
};

// Singleton Pool
const pool: ConnectionPool = new sql.ConnectionPool(config);

let poolConnect: Promise<ConnectionPool> | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (!poolConnect) {
      poolConnect = pool.connect();
      await poolConnect;
      console.log('✅ Connected to MSSQL database');
    }
  } catch (err) {
    console.error('❌ Error connecting to MSSQL database:', err);
    throw err;
  }
};

// Export pool for queries
export { pool };
