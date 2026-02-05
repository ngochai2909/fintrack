import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';



export const POST = async (req: NextRequest) => {
  const serviceAdapter = new GoogleGenerativeAIAdapter({
    model: 'gemini-3-flash',
  });

const runtime = new CopilotRuntime();
  
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
