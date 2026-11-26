'use client';

import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';

export interface TocItem {
  id: string;
  label: string;
  index?: string;
}

export function ChapterToc({ title, items }: { title: string; items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0.05 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={title}
      className="no-print bg-[#FAF8F3] border border-[#103B50]/12 rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#103B50]">
        <List className="w-3.5 h-3.5 text-[#087E9B]" />
        <span>{title}</span>
      </div>
      <ol className="space-y-1.5 text-xs">
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
                className={`flex items-baseline gap-2 py-1 px-2 rounded transition-colors ${
                  isActive
                    ? 'bg-white text-[#087E9B] font-semibold border border-[#087E9B]/20'
                    : 'text-[#51636D] hover:text-[#103B50] hover:bg-white/60'
                }`}
              >
                <span className="tabular-nums text-[11px] opacity-70">
                  {item.index ?? `0${idx + 1}`}
                </span>
                <span className="truncate">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
