'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import { getChats, getAvailableUsers, getOrCreateChat } from '../../src/apis/chat';
import Icon from '../../src/components/Icon';
import { Line, Shimmer } from '../../src/components/Shimmer';
import { Avatar, EmptyState, ErrorState, Spinner, buttonStyles, inputStyles } from '../../src/components/ui';
import { formatChatTime } from '../../src/lib/format';
import { ChatAvatar, ChatListFrame, ChatRowsSkeleton, chatTitle } from './shared';

function NewChatDialog({ onClose }) {
  const router = useRouter();
  const [state, setState] = useState({ status: 'loading', users: [] });
  const [query, setQuery] = useState('');
  const [startingId, setStartingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getAvailableUsers().then(
      ({ data }) => !cancelled && setState({ status: 'ready', users: data || [] }),
      () => !cancelled && setState({ status: 'error', users: [] }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const startChat = async (userId) => {
    setStartingId(userId);
    setError('');
    try {
      const { data } = await getOrCreateChat(userId);
      router.push(`/chat/${data._id}`);
    } catch {
      setError('Couldn’t start that conversation. Try again.');
      setStartingId(null);
    }
  };

  const q = query.trim().toLowerCase();
  const users = q
    ? state.users.filter((u) => u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
    : state.users;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-chat-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[70vh] w-full max-w-md animate-fade-in flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-line pl-5 pr-2">
          <h2 id="new-chat-title" className="text-sm font-semibold text-fg">
            New conversation
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={buttonStyles({ variant: 'ghost', size: 'icon' })}
            aria-label="Close"
          >
            <Icon name="x" />
          </button>
        </header>
        <div className="shrink-0 border-b border-line p-3">
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people"
              aria-label="Search people"
              className={`${inputStyles} h-9 w-full pl-9 pr-3`}
            />
          </div>
          {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <div className="flex-1 overflow-y-auto p-2" aria-busy={state.status === 'loading' || undefined}>
          {state.status === 'loading' ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <Line className="w-28" />
                  <Line size="xs" className="w-44" />
                </div>
              </div>
            ))
          ) : state.status === 'error' ? (
            <p className="px-3 py-8 text-center text-sm text-subtle">Couldn’t load people. Close and try again.</p>
          ) : users.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-subtle">
              {q ? `No one matches “${query.trim()}”.` : 'No other registered users yet.'}
            </p>
          ) : (
            users.map((u) => (
              <button
                key={u._id}
                type="button"
                onClick={() => startChat(u._id)}
                disabled={startingId !== null}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface-2 disabled:cursor-default"
              >
                <Avatar name={u.username} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-fg">{u.username}</p>
                  <p className="truncate text-xs text-subtle">{u.email}</p>
                </div>
                {startingId === u._id ? (
                  <Spinner className="w-4 h-4 text-accent-text" />
                ) : (
                  <Icon name="chevronRight" className="w-4 h-4 text-subtle" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [state, setState] = useState({ status: 'loading', chats: [] });
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = useCallback(() => setDialogOpen(false), []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login');
  }, [authLoading, isAuthenticated, router]);

  const loadChats = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }));
    getChats().then(
      ({ data }) => setState({ status: 'ready', chats: data || [] }),
      () => setState({ status: 'error', chats: [] }),
    );
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadChats();
  }, [isAuthenticated, loadChats]);

  const newChatButton = (
    <button
      type="button"
      onClick={() => setDialogOpen(true)}
      disabled={!isAuthenticated}
      className={buttonStyles({ variant: 'primary' })}
    >
      <Icon name="plus" />
      <span className="hidden sm:inline">New conversation</span>
    </button>
  );

  let body;
  if (authLoading || !isAuthenticated || state.status === 'loading') {
    body = <ChatRowsSkeleton />;
  } else if (state.status === 'error') {
    body = (
      <div className="p-2">
        <ErrorState
          title="Couldn’t load your conversations"
          description="The chat service didn’t respond. Your session may have expired."
          onRetry={loadChats}
        />
      </div>
    );
  } else if (state.chats.length === 0) {
    body = (
      <EmptyState
        icon="chat"
        title="No conversations yet"
        description="Start a one-to-one chat with any registered user."
        action={
          <button type="button" onClick={() => setDialogOpen(true)} className={buttonStyles()}>
            <Icon name="plus" />
            Find someone to message
          </button>
        }
      />
    );
  } else {
    body = (
      <ul className="divide-y divide-line">
        {state.chats.map((chat) => {
          const name = chatTitle(chat, user?._id);
          const last = chat.lastMessage;
          return (
            <li key={chat._id} className="animate-fade-in">
              <Link href={`/chat/${chat._id}`} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2/60">
                <ChatAvatar chat={chat} name={name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-fg">{name}</p>
                    <span className="shrink-0 text-xs tabular-nums text-subtle">{formatChatTime(last?.createdAt)}</span>
                  </div>
                  <p className="truncate text-sm text-muted">
                    {last?.content || <span className="text-subtle">No messages yet</span>}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      <ChatListFrame
        subtitle={
          user ? (
            <span>
              Signed in as <span className="font-medium text-fg">{user.username}</span>
            </span>
          ) : (
            <Shimmer className="h-3 w-40" />
          )
        }
        action={newChatButton}
      >
        {body}
      </ChatListFrame>
      {dialogOpen && <NewChatDialog onClose={closeDialog} />}
    </>
  );
}
