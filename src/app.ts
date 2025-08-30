import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './api/routes/auth.routes';
import { connectDB } from './config/database/connection';
import { errorHandler, responseHandler } from './api/middlewares';
import allRouter from './api/routes/routes';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Origin'],
  })
);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// **Attach response middleware BEFORE routes**
app.use(responseHandler);

// Logging
app.use(morgan('dev'));

// API routes
app.use('/api/v1', allRouter);

// Global error handler (after routes)
app.use(errorHandler);

// Connect to DB
connectDB().catch(err => console.error('DB connection failed:', err));

export default app;
