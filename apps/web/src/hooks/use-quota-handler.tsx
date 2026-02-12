'use client';

import { useState, useEffect } from 'react';
import { QuotaExhaustedMessage } from '@/components/quota-exhausted-message';

/**
 * Hook to handle CopilotKit quota errors
 * Automatically shows beautiful UI when all API keys are exhausted
 */
export function useQuotaHandler() {
  const [showQuotaMessage, setShowQuotaMessage] = useState(false);

  useEffect(() => {
    // Listen for CopilotKit errors
    const handleCopilotError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Check if it's a quota error
      if (
        error?.message?.includes('QUOTA_EXHAUSTED') ||
        error?.message?.includes('quota') ||
        error?.status === 429
      ) {
        setShowQuotaMessage(true);
      }
    };

    // Listen for fetch errors (CopilotKit uses fetch internally)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Check if it's CopilotKit API and has quota error
        if (
          args[0]?.toString().includes('/api/copilotkit') &&
          response.status === 429
        ) {
          const data = await response.clone().json();
          if (data.error === 'QUOTA_EXHAUSTED') {
            setShowQuotaMessage(true);
          }
        }
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    window.addEventListener('error', handleCopilotError);
    
    return () => {
      window.removeEventListener('error', handleCopilotError);
      window.fetch = originalFetch;
    };
  }, []);

  return {
    showQuotaMessage,
    setShowQuotaMessage,
    QuotaMessage: (
      <QuotaExhaustedMessage
        show={showQuotaMessage}
        onClose={() => setShowQuotaMessage(false)}
      />
    ),
  };
}
