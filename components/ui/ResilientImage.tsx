'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Compass } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  fill = false,
  width,
  height,
  priority = false,
  sizes,
  className = '',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#103B50] via-[#087E9B] to-[#356B50] text-[#F4EFE5] p-6 text-center ${
          fill ? 'absolute inset-0 w-full h-full' : 'w-full h-full min-h-[220px]'
        } ${className}`}
      >
        <Compass className="w-8 h-8 mb-3 opacity-80" aria-hidden="true" />
        <span className="font-serif text-lg font-medium tracking-tight">
          {fallbackTitle || alt}
        </span>
        <span className="text-xs opacity-75 mt-1">Béjaïa Explorer</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width ?? 800}
      height={fill ? undefined : height ?? 600}
      priority={priority}
      sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
