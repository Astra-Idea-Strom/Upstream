import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      statusCode: 400,
      details: errors.array(),
    });
    return;
  }
  next();
};

export const validateProjectId = [
  param('id')
    .notEmpty().withMessage('Project ID is required')
    .isString().trim()
    .isLength({ min: 1, max: 128 }).withMessage('Invalid project ID length'),
  handleValidation,
];

export const validateSaveProject = [
  body()
    .custom((value) => {
      const target = value?.project || value;
      if (!target || typeof target !== 'object' || Object.keys(target).length === 0) {
        throw new Error('Project data cannot be empty');
      }
      return true;
    }),
  handleValidation,
];
