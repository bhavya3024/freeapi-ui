'use client';
import Link from 'next/link';
import Icon from './Icon';
import { useStoredValue } from '../hooks/useStoredValue';

export const lastListKey = (slug) => `freeapi:last-list:${slug}`;

// Returns to the list page the user came from (including its ?page=), falling back to page 1.
export default function BackLink({ slug, label }) {
  const [href] = useStoredValue(lastListKey(slug), `/${slug}`, 'session');

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted transition-colors hover:text-fg"
    >
      <Icon name="arrowLeft" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}
