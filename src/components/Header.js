'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';
import { Shimmer } from './Shimmer';
import { Avatar, buttonStyles } from './ui';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-sm">
        <Icon name="zap" className="w-4 h-4" />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-fg">
        FreeAPI <span className="hidden font-normal text-subtle sm:inline">Explorer</span>
      </span>
    </Link>
  );
}

// Live result of the upstream /healthcheck, not a hardcoded badge
function ApiStatus() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    axios.get('/api/health').then(
      ({ data }) => !cancelled && setStatus(data?.success ? 'online' : 'offline'),
      () => !cancelled && setStatus('offline'),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') {
    return <Shimmer className="hidden h-7 w-24 rounded-full sm:block" />;
  }

  const online = status === 'online';
  return (
    <span
      className="hidden h-7 items-center gap-2 rounded-full border border-line px-3 text-xs font-medium text-muted sm:inline-flex"
      title={online ? 'FreeAPI health check passed' : 'FreeAPI health check failed'}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {online ? 'API online' : 'API unreachable'}
    </span>
  );
}

function AccountArea() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2" aria-hidden="true">
        <Shimmer className="h-8 w-8 rounded-full" />
        <Shimmer className="hidden h-3 w-20 sm:block" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 pl-1 pr-1.5">
          <Avatar name={user?.username} size="sm" />
          <span className="hidden max-w-40 truncate text-sm font-medium text-fg sm:block">{user?.username}</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className={buttonStyles({ variant: 'ghost', size: 'icon' })}
          aria-label="Log out"
          title="Log out"
        >
          <Icon name="logOut" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/login" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
        Sign in
      </Link>
      <Link href="/register" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
        Sign up
      </Link>
    </div>
  );
}

export default function Header({ onOpenNav }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface/80 px-4 backdrop-blur-md lg:px-6">
      <button
        type="button"
        onClick={onOpenNav}
        className={buttonStyles({ variant: 'ghost', size: 'icon', className: '-ml-2 lg:hidden' })}
        aria-label="Open navigation"
      >
        <Icon name="menu" className="w-5 h-5" />
      </button>
      <Logo />
      <div className="ml-auto flex items-center gap-2">
        <ApiStatus />
        <ThemeToggle />
        <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
        <AccountArea />
      </div>
    </header>
  );
}
