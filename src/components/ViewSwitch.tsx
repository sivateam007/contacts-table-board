import type { KeyboardEvent, RefObject } from 'react';
import type { ViewMode } from '../types';

const TABS: { id: ViewMode; label: string }[] = [
  { id: 'table', label: 'Table' },
  { id: 'board', label: 'Board' },
];

interface Props {
  value: ViewMode;
  onChange: (view: ViewMode) => void;
  /** Ref used to restore focus if a detail panel's opener disappears. */
  listRef?: RefObject<HTMLDivElement | null>;
}

function TableIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.5" />
      <path d="M1.75 6.25h12.5M6.5 6.25v7" strokeLinecap="round" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.75" y="2.75" width="4" height="10.5" rx="1.5" />
      <rect x="10.25" y="2.75" width="4" height="6.5" rx="1.5" />
    </svg>
  );
}

/**
 * Segmented control implemented as a tab list: arrow keys move between views,
 * the inactive tab is removed from the tab order (roving tabindex).
 */
export function ViewSwitch({ value, onChange, listRef }: Props) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TABS.findIndex((tab) => tab.id === value);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % TABS.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = TABS.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    const next = TABS[nextIndex];
    onChange(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Contact view"
      onKeyDown={onKeyDown}
      className="inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1"
    >
      {TABS.map((tab) => {
        const selected = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`viewpanel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              selected
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200/70'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.id === 'table' ? <TableIcon /> : <BoardIcon />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
