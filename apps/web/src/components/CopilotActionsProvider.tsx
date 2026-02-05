'use client';

import { useFinTrackActions } from '@/hooks/useFinTrackActions';
import { ReactNode } from 'react';

/**
 * Client component wrapper for initializing global CopilotKit actions
 * Must be used within CopilotKit provider context
 */
export function CopilotActionsProvider({ children }: { children: ReactNode }) {
  // Initialize global actions
  useFinTrackActions();
  
  // Pass through children
  return <>{children}</>;
}
