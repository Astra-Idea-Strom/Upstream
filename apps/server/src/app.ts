import 'dotenv/config';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import projectRoutes from './routes/project.routes';

const app: Express = express();

// ── Security Middleware ────────────────────────────────────
app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
  })
);

// ── Parsing Middleware ─────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ──────────────────────────────────────────
app.use(rateLimiter);

// ── Health Check Endpoints ─────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: '@upstream/server',
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: '@upstream/server',
  });
});

// ── Routes Owned by Dev 4 ──────────────────────────────────
// Supports both /api/projects and /api/brand (for POST /api/brand/save)
app.use('/api/projects', projectRoutes);
app.use('/api/brand', projectRoutes);

// ── Error Handling Middleware (Must be registered last) ────
app.use(errorHandler);

export default app;
