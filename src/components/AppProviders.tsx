'use client';

import { SessionProvider } from 'next-auth/react';
import StoreProvider from '@/src/store/StoreProvider';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </SessionProvider>
  );
}
