'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TableSkeletonRows } from './Shimmer';
import { cardStyles } from './ui';

const ALIGN = { left: 'text-left', center: 'text-center', right: 'text-right' };

/**
 * columns: [{ key, label, align, className, render(item), skeleton }]
 * `skeleton` picks the placeholder shape while loading (media | avatar | video | badge | lines | text).
 * The first column's content is wrapped in a real link for keyboard and screen-reader users;
 * the rest of the row is clickable with the mouse.
 */
export default function Table({ columns, items, loading, getKey, getHref, empty, skeletonRows = 12 }) {
  const router = useRouter();

  return (
    // Caps at the available height and scrolls both ways inside the card, so the header row can stick
    <div className={`${cardStyles} flex max-h-full min-h-0 flex-col overflow-hidden`}>
      <div data-scroll-region className="min-h-0 overflow-auto overscroll-contain">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`sticky top-0 z-10 h-10 whitespace-nowrap bg-surface-2 px-4 text-xs font-medium text-muted shadow-[inset_0_-1px_0_var(--border)] ${ALIGN[col.align || 'left']} ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line" aria-busy={loading || undefined}>
            {loading ? (
              <TableSkeletonRows columns={columns} rows={skeletonRows} />
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>{empty}</td>
              </tr>
            ) : (
              items.map((item) => {
                const href = getHref(item);
                return (
                  <tr
                    key={getKey(item)}
                    onClick={(e) => {
                      if (!e.target.closest('a, button')) router.push(href);
                    }}
                    className="animate-fade-in cursor-pointer transition-colors hover:bg-surface-2/60"
                  >
                    {columns.map((col, i) => (
                      <td key={col.key} className={`px-4 py-3 align-middle ${ALIGN[col.align || 'left']}`}>
                        {i === 0 ? (
                          <Link href={href} className="block rounded">
                            {col.render(item)}
                          </Link>
                        ) : (
                          col.render(item)
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
