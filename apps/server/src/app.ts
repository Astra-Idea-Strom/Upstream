import 'dotenv/config';
import 'express-async-errors';
import path from 'path';
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import projectRoutes from './routes/project.routes';
import brandRoutes from './routes/brand.routes';
import domainRoutes from './routes/domain.routes';
import logoRoutes from './routes/logo.routes';

const app: Express = express();

// ── Security Middleware ────────────────────────────────────
// crossOriginResourcePolicy is relaxed so generated artwork can be embedded
// from the client origin (5173) while the API runs on 3001.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

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
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

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

// ── Generated artwork (logos, certificates, uploads) ───────
// Served under /api so the Vite dev proxy (/api → :3001) resolves it from the
// client origin without CORS. `/generated` is kept as a direct alias.
const generatedDir = path.resolve(__dirname, '../public/generated');
app.use(
  '/api/assets/generated',
  express.static(generatedDir, { maxAge: '7d', immutable: true, fallthrough: true })
);
app.use('/generated', express.static(generatedDir, { maxAge: '7d', fallthrough: true }));

// ── Application Routes ─────────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/domain', domainRoutes);
app.use('/api/logos', logoRoutes);

// ── Error Handling Middleware (Must be registered last) ────
app.use(errorHandler);

export default app;
