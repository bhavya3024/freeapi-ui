// Pieces shared by /chat, /chat/[id] and their loading states (no hooks, so loading.js can use them)
import { CHAT_APP } from "../../src/config/collections";
import Icon from "../../src/components/Icon";
import Link from "next/link";
import { ChatMessagesSkeleton, ChatRowSkeleton, Line, LoadingRegion, Shimmer } from "../../src/components/Shimmer";
import { Avatar, IconTile, buttonStyles, cardStyles, fillViewport, inputStyles } from "../../src/components/ui";

export function chatTitle(chat, currentUserId) {
  if (chat?.isGroupChat) return chat.name || 'Group chat';
  return chat?.participants?.find((p) => p._id !== currentUserId)?.username || 'Unknown user';
}

/** 40px avatar: initial for direct chats, a group icon for group chats (ChatRowSkeleton mirrors it). */
export function ChatAvatar({ chat, name }) {
  if (!chat?.isGroupChat) return <Avatar name={name} size="md" />;
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
      <Icon name="users" className="w-[18px] h-[18px]" />
    </span>
  );
}

/** Page chrome shared by the live list and its skeleton. */
export function ChatListFrame({ subtitle, action, children }) {
  return (
    // Only the conversation list scrolls; it shrinks to its content and caps at the space left
    <div className={`mx-auto flex max-w-3xl flex-col gap-6 ${fillViewport}`}>
      <div className="flex shrink-0 items-start gap-4">
        <IconTile icon={CHAT_APP.icon} tone={CHAT_APP.tone} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Conversations</h1>
          <div className="mt-1 flex h-5 items-center text-sm text-muted">{subtitle}</div>
        </div>
        {action}
      </div>
      <div className={`${cardStyles} min-h-0 overflow-y-auto overscroll-contain`}>{children}</div>
    </div>
  );
}

export function ChatRowsSkeleton({ count = 5 }) {
  return (
    <LoadingRegion label="Loading conversations" className="divide-y divide-line">
      {Array.from({ length: count }).map((_, i) => (
        <ChatRowSkeleton key={i} />
      ))}
    </LoadingRegion>
  );
}

export default function ChatListSkeleton() {
  return (
    <ChatListFrame subtitle={<Shimmer className="h-3 w-40" />} action={<Shimmer className="h-9 w-40 rounded-lg" />}>
      <ChatRowsSkeleton />
    </ChatListFrame>
  );
}

/* ---------------------------------------------------------------- /chat/[id] */

export function ChatRoomFrame({ header, children, footer, scrollRef }) {
  return (
    <div className={`mx-auto flex max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-surface ${fillViewport}`}>
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-3 sm:px-4">{header}</header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-bg/40 px-4 py-5 sm:px-6">
        {children}
      </div>
      {footer && <div className="shrink-0 border-t border-line p-3 sm:p-4">{footer}</div>}
    </div>
  );
}

export function BackToChats() {
  return (
    <Link href="/chat" className={buttonStyles({ variant: 'ghost', size: 'icon' })} aria-label="Back to conversations">
      <Icon name="arrowLeft" />
    </Link>
  );
}

export const composerInputStyles = `${inputStyles} h-10 min-w-0 flex-1 px-4`;

export function ChatRoomSkeleton() {
  return (
    <ChatRoomFrame
      header={
        <>
          <BackToChats />
          <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1">
            <Line className="w-32" />
            <Line size="xs" className="w-20" />
          </div>
        </>
      }
      footer={
        <div className="flex items-center gap-2">
          <div className={`${composerInputStyles} flex items-center text-subtle`}>Write a message…</div>
          <span className={buttonStyles({ variant: 'primary', size: 'icon', className: 'opacity-50' })}>
            <Icon name="send" />
          </span>
        </div>
      }
    >
      <LoadingRegion label="Loading messages">
        <ChatMessagesSkeleton />
      </LoadingRegion>
    </ChatRoomFrame>
  );
}
