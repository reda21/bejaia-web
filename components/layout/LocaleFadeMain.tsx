'use client';

import React from 'react';
import { useApp } from '@/components/providers/AppProviders';

export function LocaleFadeMain({ children }: { children: React.ReactNode }) {
  const { isLocaleTransitioning } = useApp();

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`flex-1 outline-none transition-opacity duration-200 ease-out ${
        isLocaleTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {children}
    </main>
  );
}
