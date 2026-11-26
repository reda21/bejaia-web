'use client';

import React from 'react';
import { useApp } from '@/components/providers/AppProviders';

export function LocaleFadeMain({ children }: { children: React.ReactNode }) {
  const { isLocaleTransitioning } = useApp();

  return (
    <main
      className={`flex-1 transition-opacity duration-200 ease-out ${
        isLocaleTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </main>
  );
}
