'use client';
import { useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import SideBar from './SideBar';

export default function AppShell({ children }) {
  const pathname = usePathname();
  // Remember which path the drawer was opened on so navigating anywhere closes it
  const [openedOn, setOpenedOn] = useState(null);
  const navOpen = openedOn === pathname;
  const closeNav = useCallback(() => setOpenedOn(null), []);

  return (
    <div className="flex h-dvh flex-col">
      <Header onOpenNav={() => setOpenedOn(pathname)} />
      <div className="relative flex min-h-0 flex-1">
        <SideBar open={navOpen} onClose={closeNav} />
        <main id="main" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
