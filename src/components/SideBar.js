'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { COLLECTIONS, CHAT_APP } from '../config/collections';
import Icon from './Icon';
import { Logo } from './Header';
import { Shimmer } from './Shimmer';
import { IconTile, buttonStyles } from './ui';

function NavItem({ href, icon, tone = 'zinc', label, active }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex h-9 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors ${
        active ? 'bg-surface-2 font-medium text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg'
      }`}
    >
      <IconTile icon={icon} tone={tone} size="sm" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SectionLabel({ children, count }) {
  return (
    <div className="mb-1 mt-6 flex items-center justify-between px-2 first:mt-0">
      <span className="text-xs font-medium text-subtle">{children}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-subtle">{count}</span>}
    </div>
  );
}

export default function SideBar({ open, onClose }) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const q = query.trim().toLowerCase();
  const collections = COLLECTIONS.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
  );
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      {/* Off-canvas below lg; `invisible` (delayed by the transition) keeps the closed drawer out of the tab order */}
      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface transition-[transform,visibility] duration-200 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:visible ${
          open ? 'visible translate-x-0' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4 lg:hidden">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className={buttonStyles({ variant: 'ghost', size: 'icon', className: '-mr-2' })}
            aria-label="Close navigation"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="relative mb-4">
            <Icon name="search" className="pointer-events-none absolute left-2.5 top-1/2 w-3.5 h-3.5 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter collections"
              aria-label="Filter collections"
              className="h-8 w-full rounded-lg border border-line bg-surface-2 pl-8 pr-2 text-sm text-fg placeholder:text-subtle focus:border-accent focus:bg-surface focus:outline-none"
            />
          </div>

          <nav className="space-y-0.5">
            <NavItem href="/" icon="home" label="Overview" active={isActive('/')} />
          </nav>

          <SectionLabel count={collections.length}>Collections</SectionLabel>
          <nav className="space-y-0.5">
            {collections.map((c) => (
              <NavItem
                key={c.slug}
                href={`/${c.slug}`}
                icon={c.icon}
                tone={c.tone}
                label={c.name}
                active={isActive(`/${c.slug}`)}
              />
            ))}
            {collections.length === 0 && (
              <p className="px-2 py-2 text-sm text-subtle">No collections match “{query}”.</p>
            )}
          </nav>

          <SectionLabel>Apps</SectionLabel>
          {loading ? (
            <div className="flex h-9 items-center gap-2.5 px-2" aria-hidden="true">
              <Shimmer className="h-7 w-7" />
              <Shimmer className="h-3 w-16" />
            </div>
          ) : isAuthenticated ? (
            <nav className="space-y-0.5">
              <NavItem
                href={`/${CHAT_APP.slug}`}
                icon={CHAT_APP.icon}
                tone={CHAT_APP.tone}
                label={CHAT_APP.name}
                active={isActive(`/${CHAT_APP.slug}`)}
              />
            </nav>
          ) : (
            <div className="mx-1 rounded-lg border border-line bg-surface-2 p-3">
              <p className="text-sm text-muted">Sign in to message other users in real time.</p>
              <Link href="/login" className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'mt-3 w-full' })}>
                <Icon name="logIn" className="w-3.5 h-3.5" />
                Sign in to chat
              </Link>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-line px-5 py-3 text-xs text-subtle">
          Data from{' '}
          <a
            href="https://freeapi.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-muted hover:text-fg"
          >
            freeapi.app
          </a>
        </div>
      </aside>
    </>
  );
}
