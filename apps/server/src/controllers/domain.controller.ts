import { Request, Response } from 'express';
import { checkDomains } from '../services/domain.service';
import type { CheckDomainsRequest, CheckDomainsResponse } from '@upstream/shared';

/**
 * POST /api/domain/check
 * Returns availability status for requested brand names
 */
export const checkDomainAvailability = async (req: Request, res: Response): Promise<void> => {
  const { names }: CheckDomainsRequest = req.body;

  if (!names || !Array.isArray(names) || names.length === 0) {
    res.status(400).json({
      error: 'INVALID_NAMES',
      message: 'An array of brand names is required.',
      statusCode: 400,
    });
    return;
  }

  const results = checkDomains(names);
  const response: CheckDomainsResponse = { results };
  res.status(200).json(response);
};
