'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../src/context/AuthContext';
import { getChatById, getMessages, sendMessage } from '../../../src/apis/chat';
import Icon from '../../../src/components/Icon';
import { ErrorState, Spinner, buttonStyles } from '../../../src/components/ui';
import { formatDayLabel } from '../../../src/lib/format';
import { BackToChats, ChatAvatar, ChatRoomFrame, ChatRoomSkeleton, chatTitle, composerInputStyles } from '../shared';

const byTime = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
const dayKey = (value) => new Date(value).toDateString();

function Message({ message, own, showSender }) {
  return (
    <div className={`flex animate-fade-in ${own ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] flex-col gap-1 sm:max-w-[70%] ${own ? 'items-end' : 'items-start'}`}>
        {showSender && <span className="px-1 text-xs font-medium text-subtle">{message.sender?.username}</span>}
        <div
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm leading-6 ${
            own ? 'rounded-br-md bg-accent text-accent-fg' : 'rounded-bl-md bg-surface-2 text-fg'
          }`}
        >
          {message.content}
          {message.attachments?.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((att, i) => (
                <a
                  key={att.url || i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs underline underline-offset-2 opacity-90 hover:opacity-100"
                >
                  <Icon name="paperclip" className="w-3.5 h-3.5" />
                  Attachment {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
        <time dateTime={message.createdAt} className="px-1 text-[11px] tabular-nums text-subtle">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
}

function DaySeparator({ label }) {
  return (
    <div className="flex items-center gap-3 py-1" role="separator">
      <span className="h-px flex-1 bg-line" />
      <span className="text-xs font-medium text-subtle">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default function ChatRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [state, setState] = useState({ status: 'loading', chat: null, messages: [] });
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/login');
  }, [authLoading, isAuthenticated, router]);

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: 'loading' }));
    Promise.all([getChatById(id), getMessages(id)]).then(
      ([chatRes, messagesRes]) =>
        setState({ status: 'ready', chat: chatRes.data, messages: [...(messagesRes.data || [])].sort(byTime) }),
      () => setState({ status: 'error', chat: null, messages: [] }),
    );
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id) load();
  }, [isAuthenticated, id, load]);

  // Keep the newest message in view (scroll the thread, not the page)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setSendError('');
    try {
      const { data } = await sendMessage(id, content);
      setState((s) => ({ ...s, messages: [...s.messages, data] }));
      setDraft('');
    } catch {
      setSendError('Message not sent. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  if (authLoading || !isAuthenticated || state.status === 'loading') {
    return <ChatRoomSkeleton />;
  }

  if (state.status === 'error') {
    return (
      <ChatRoomFrame
        header={
          <>
            <BackToChats />
            <h1 className="text-sm font-semibold text-fg">Conversation</h1>
          </>
        }
        footer={null}
      >
        <ErrorState
          title="Couldn’t open this conversation"
          description="It may have been deleted, or your session may have expired."
          onRetry={load}
        />
      </ChatRoomFrame>
    );
  }

  const { chat, messages } = state;
  const name = chatTitle(chat, user?._id);

  // Interleave day separators with messages
  const thread = [];
  let lastDay = null;
  for (const message of messages) {
    const day = dayKey(message.createdAt);
    if (day !== lastDay) {
      thread.push(<DaySeparator key={`day-${day}`} label={formatDayLabel(message.createdAt)} />);
      lastDay = day;
    }
    const own = message.sender?._id === user?._id;
    thread.push(<Message key={message._id} message={message} own={own} showSender={chat?.isGroupChat && !own} />);
  }

  return (
    <ChatRoomFrame
      scrollRef={scrollRef}
      header={
        <>
          <BackToChats />
          <ChatAvatar chat={chat} name={name} />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-fg">{name}</h1>
            <p className="truncate text-xs text-subtle">
              {chat?.isGroupChat ? `${chat.participants?.length || 0} members` : 'Direct message'}
            </p>
          </div>
        </>
      }
      footer={
        <form onSubmit={handleSend}>
          {sendError && <p className="mb-2 text-xs text-red-600 dark:text-red-400">{sendError}</p>}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
              aria-label="Message"
              disabled={sending}
              className={composerInputStyles}
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              className={buttonStyles({ variant: 'primary', size: 'icon' })}
              aria-label="Send message"
            >
              {sending ? <Spinner /> : <Icon name="send" />}
            </button>
          </div>
        </form>
      }
    >
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <ChatAvatar chat={chat} name={name} />
          <p className="mt-3 text-sm font-semibold text-fg">This is the start of your conversation with {name}</p>
          <p className="mt-1 text-sm text-muted">Say hello 👋</p>
        </div>
      ) : (
        <div className="space-y-3">{thread}</div>
      )}
    </ChatRoomFrame>
  );
}
