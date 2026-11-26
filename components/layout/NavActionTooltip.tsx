'use client';

import React, { useEffect, useRef, useState } from 'react';

interface NavActionTooltipProps {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  align?: 'center' | 'end';
}

export function NavActionTooltip({
  id,
  label,
  description,
  shortcut,
  align = 'end',
}: NavActionTooltipProps) {
  const [dismissed, setDismissed] = useState(false);
  const tooltipWrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const parent = tooltipWrapperRef.current?.parentElement;
    if (!parent) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (parent.matches(':hover') || parent.matches(':focus-within')) {
        setDismissed(true);
      }
    };

    const resetDismissed = () => setDismissed(false);

    window.addEventListener('keydown', handleEscape);
    parent.addEventListener('pointerleave', resetDismissed);
    parent.addEventListener('focusout', resetDismissed);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      parent.removeEventListener('pointerleave', resetDismissed);
      parent.removeEventListener('focusout', resetDismissed);
    };
  }, []);

  return (
    <span
      ref={tooltipWrapperRef}
      id={id}
      role="tooltip"
      aria-hidden={dismissed ? 'true' : undefined}
      className={`pointer-events-none absolute top-full pt-2 z-50 w-max max-w-[240px] transition-[opacity,transform] duration-150 ease-out ${
        align === 'center' ? 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2' : 'end-0'
      } ${
        dismissed
          ? 'opacity-0 translate-y-1 !pointer-events-none'
          : 'opacity-0 translate-y-1 peer-hover:pointer-events-auto peer-hover:opacity-100 peer-hover:translate-y-0 peer-focus-visible:pointer-events-auto peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0 hover:pointer-events-auto hover:opacity-100 hover:translate-y-0 peer-aria-expanded:opacity-0 peer-aria-expanded:pointer-events-none'
      }`}
    >
      <span className="block rounded-md border border-[#103B50]/15 bg-white px-2.5 py-1.5 text-start shadow-lg">
        <span className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#103B50] leading-snug">
          <span>{label}</span>
          {shortcut && (
            <kbd className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F4EFE5] text-[#51636D] shrink-0">
              {shortcut}
            </kbd>
          )}
        </span>
        {description && (
          <span className="mt-0.5 block text-[10px] font-normal text-[#51636D] leading-snug">
            {description}
          </span>
        )}
      </span>
    </span>
  );
}
