import { Request, Response, NextFunction } from 'express';
import type { ApiError } from '@upstream/shared';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || err.name || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  console.error(`[Error] ${errorCode} (${statusCode}): ${message}`);
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack);
  }

  const responseBody: ApiError = {
    error: errorCode,
    message,
    statusCode,
  };

  res.status(statusCode).json(responseBody);
};
