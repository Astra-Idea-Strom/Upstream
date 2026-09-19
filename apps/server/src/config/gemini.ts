import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ GEMINI_API_KEY is not set in environment variables.');
}

export const genAI = new GoogleGenerativeAI(apiKey || '');

// Default model name for Gemini image generation
export const GEMINI_IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-preview-image-generation';
