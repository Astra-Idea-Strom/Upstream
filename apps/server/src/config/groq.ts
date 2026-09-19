import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.warn('⚠️ GROQ_API_KEY is not set in environment variables.');
}

export const groq = new Groq({
  apiKey: apiKey || '',
});

// Default OSS-120B model on Groq
export const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
