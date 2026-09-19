import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 100,            // 100 requests per window per IP
  message: {
    error: 'RATE_LIMITED',
    message: 'Too many requests. Please wait a moment.',
    statusCode: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
