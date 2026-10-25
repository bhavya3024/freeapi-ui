'use client';
import { useState } from 'react';
import Icon from './Icon';
import { buttonStyles, inputStyles } from './ui';

// First, last, and a window around the current page, with gaps collapsed to an ellipsis
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 4) [2, 3, 4, 5].forEach((p) => pages.add(p));
  if (current >= total - 3) [total - 4, total - 3, total - 2, total - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev === 2) out.push(prev + 1);
    else if (p - prev > 2) out.push(`gap-${p}`);
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({ page, totalPages, totalItems, pageSize, hasNext, onChange, disabled }) {
  const [jump, setJump] = useState('');
  const total = totalPages || page;
  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : hasNext;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems || 0);

  const submitJump = (e) => {
    e.preventDefault();
    const target = Number.parseInt(jump, 10);
    if (target >= 1 && target <= total && target !== page) onChange(target);
    setJump('');
  };

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="flex h-9 items-center gap-3 text-sm text-muted">
        {totalItems && from <= totalItems ? (
          <p>
            Showing <span className="font-medium tabular-nums text-fg">{from}–{to}</span> of{' '}
            <span className="font-medium tabular-nums text-fg">{totalItems.toLocaleString()}</span>
          </p>
        ) : (
          <p>Page {page}</p>
        )}
        {total > 7 && (
          <form onSubmit={submitJump} className="hidden items-center gap-2 whitespace-nowrap md:flex">
            <span className="h-4 w-px bg-line" />
            <label htmlFor="page-jump">Go to</label>
            <input
              id="page-jump"
              type="number"
              inputMode="numeric"
              min={1}
              max={total}
              value={jump}
              onChange={(e) => setJump(e.target.value)}
              placeholder={String(page)}
              disabled={disabled}
              className={`${inputStyles} h-8 w-16 px-2 text-center tabular-nums`}
            />
          </form>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={!canPrev || disabled}
          className={buttonStyles({ className: 'pl-2.5' })}
        >
          <Icon name="chevronLeft" />
          Previous
        </button>

        <div className="hidden items-center gap-1 sm:flex">
          {pageList(page, total).map((p) =>
            typeof p === 'string' ? (
              <span key={p} className="w-9 text-center text-sm text-subtle" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => p !== page && onChange(p)}
                disabled={disabled && p !== page}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium tabular-nums transition-colors disabled:opacity-50 ${
                  p === page ? 'bg-accent text-accent-fg shadow-sm' : 'cursor-pointer text-muted hover:bg-surface-2 hover:text-fg'
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>
        <span className="px-2 text-sm tabular-nums text-muted sm:hidden">
          {page} / {total}
        </span>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={!canNext || disabled}
          className={buttonStyles({ className: 'pr-2.5' })}
        >
          Next
          <Icon name="chevronRight" />
        </button>
      </div>
    </nav>
  );
}
