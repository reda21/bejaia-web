'use client';

import React from 'react';

interface NavActionTooltipProps {
  id: string;
  label: string;
  shortcut?: string;
  align?: 'center' | 'end';
}

export function NavActionTooltip({
  id,
  label,
  shortcut,
  align = 'end',
}: NavActionTooltipProps) {
  return (
    <span
      id={id}
      role="tooltip"
      className={`pointer-events-none absolute top-full mt-2 z-50 whitespace-nowrap rounded-md border border-[#103B50]/12 bg-white px-2.5 py-1 text-[11px] font-medium text-[#103B50] shadow-md opacity-0 translate-y-1 transition-[opacity,transform] duration-150 ease-out peer-hover:opacity-100 peer-hover:translate-y-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0 peer-aria-expanded:opacity-0 ${
        align === 'center' ? 'start-1/2 -translate-x-1/2 rtl:translate-x-1/2' : 'end-0'
      }`}
    >
      <span className="inline-flex items-center gap-1.5">
        <span>{label}</span>
        {shortcut && (
          <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-[#F4EFE5] text-[#51636D]">
            {shortcut}
          </kbd>
        )}
      </span>
    </span>
  );
}
