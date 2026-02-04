import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

/**
 * CopilotKit API Route Handler
 * 
 * This endpoint handles all CopilotKit runtime requests.
 * It uses Google Generative AI (Gemini) as the LLM provider.
 */

export const POST = async (req: NextRequest) => {
  // GoogleGenerativeAIAdapter will automatically read GOOGLE_GENERATIVE_AI_API_KEY
  const serviceAdapter = new GoogleGenerativeAIAdapter({
    model: 'gemini-1.5-flash',
  });

  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
