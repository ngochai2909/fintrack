import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

// Simple setup - use first available key
const GEMINI_API_KEY = 
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_1 ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_2 ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_3 ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_4 ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_5 ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
  '';

// Log for debugging (only show first 10 chars for security)
console.log('🔑 CopilotKit API Key Status:', GEMINI_API_KEY ? `Found (${GEMINI_API_KEY.substring(0, 10)}...)` : '❌ MISSING');

const runtime = new CopilotRuntime();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new GoogleGenerativeAIAdapter({
      model: 'gemini-1.5-flash',
      apiKey: GEMINI_API_KEY,
    }),
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
