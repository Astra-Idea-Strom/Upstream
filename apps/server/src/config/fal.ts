import { fal } from '@fal-ai/client';

const apiKey = process.env.FAL_API_KEY;

if (!apiKey) {
  console.warn('⚠️ FAL_API_KEY is not set in environment variables.');
}

if (apiKey) {
  fal.config({
    credentials: apiKey,
  });
}

export { fal };
export const FLUX_MODEL = 'fal-ai/flux/dev';
