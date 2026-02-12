'use client';

import { useQuotaHandler } from '@/hooks/use-quota-handler';

export function QuotaHandlerWrapper() {
  const { QuotaMessage } = useQuotaHandler();
  return <>{QuotaMessage}</>;
}
