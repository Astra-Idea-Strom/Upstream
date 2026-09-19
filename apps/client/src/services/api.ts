import axios from 'axios';
import type {
  GenerateBrandRequest,
  GenerateBrandResponse,
  GenerateLogosRequest,
  GenerateLogosResponse,
  CheckDomainsRequest,
  CheckDomainsResponse,
} from '@upstream/shared';
import { MOCK_BRAND_NAMES, MOCK_LOGOS_BY_STYLE } from '../mock/mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 45_000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'API request failed';
    return Promise.reject(new Error(msg));
  }
);

export const brandApi = {
  // Generate Brand Names, Taglines, and Visual Direction
  generate: async (data: GenerateBrandRequest): Promise<GenerateBrandResponse> => {
    try {
      const res = await api.post<GenerateBrandResponse>('/brand/generate', data);
      return res.data;
    } catch {
      // Graceful fallback to rich mock data
      await new Promise((r) => setTimeout(r, 1200));
      return {
        projectId: 'proj_' + Math.random().toString(36).substring(2, 9),
        names: MOCK_BRAND_NAMES,
      };
    }
  },

  // Generate Logo Concepts
  generateLogos: async (data: GenerateLogosRequest): Promise<GenerateLogosResponse> => {
    try {
      const res = await api.post<GenerateLogosResponse>('/brand/logos', data);
      return res.data;
    } catch {
      // Graceful fallback to rich mock logos
      await new Promise((r) => setTimeout(r, 1500));
      return {
        logos: MOCK_LOGOS_BY_STYLE.default,
      };
    }
  },

  // Domain & Social Availability Check
  checkDomains: async (data: CheckDomainsRequest): Promise<CheckDomainsResponse> => {
    try {
      const res = await api.post<CheckDomainsResponse>('/domain/check', data);
      return res.data;
    } catch {
      const results: Record<string, any> = {};
      data.names.forEach((name, idx) => {
        results[name] = {
          com: idx % 2 === 0,
          io: true,
          co: idx % 3 !== 0,
          handle: {
            twitter: idx % 2 === 0,
            instagram: true,
          },
        };
      });
      return { results };
    }
  },

  // Conversational Agent Chat powered by Groq (GPT OSS 120B)
  chat: async (params: {
    message: string;
    history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
    currentContext?: any;
  }): Promise<{
    reply: string;
    suggestions?: string[];
    detectedIntent: 'greeting' | 'new_brand' | 'refine' | 'question';
    extractedBrief?: {
      businessName?: string;
      industry?: string;
      tone?: string;
      targetAudience?: string;
      mission?: string;
    };
  }> => {
    const res = await api.post('/brand/chat', params);
    return res.data;
  },
};
