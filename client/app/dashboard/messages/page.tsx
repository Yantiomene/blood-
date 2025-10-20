"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';

import Header from '@/app/components/Header';
import withAuth from '@/app/components/authHOC';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '@/app/redux/store';
import { fetchCurrentUser } from '@/app/redux/userSlice';
import { getConversationsByUser, getUnreadCountsByConversation, getMessagesByConversation, createMessage, markConversationAsRead } from '@/app/api/messages';
import { getUserById } from '@/app/api/user';

interface ConversationItem { id: number; senderId: number; receiverId: number; updated_at?: string; created_at?: string; }
interface MessageItem { id: number; conversationId: number; senderId: number; recipientId: number; content: string; messageType?: string; updated_at?: string; created_at?: string; }
interface UserInfo { id: number; username?: string; email?: string; }

const MessagesListInner: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.isAuth);
  const currentUserId = useSelector((state: any) => state.user?.data?.id);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [userCache, setUserCache] = useState<Record<number, UserInfo>>({});
  const [unreadMap, setUnreadMap] = useState<Record<number, number>>({});
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [dialogMessages, setDialogMessages] = useState<MessageItem[]>([]);
  const [dialogPartnerId, setDialogPartnerId] = useState<number | null>(null);
  const [dialogPartnerLabel, setDialogPartnerLabel] = useState<string>('');
  const [dialogInput, setDialogInput] = useState<string>('');
  const dialogBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchCurrentUser() as any);
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const loadConversations = async () => {
      if (!currentUserId) return;
      setLoading(true);
      try {
        const data = await getConversationsByUser(currentUserId);
        if (!mounted) return;
        const list: ConversationItem[] = Array.isArray(data?.conversations) ? data.conversations : (Array.isArray(data) ? data : []);
        const sorted = [...list].sort((a, b) => {
          const ta = new Date(((a as any).last_message_updated_at || a.updated_at || a.created_at || 0) as any).getTime();
          const tb = new Date(((b as any).last_message_updated_at || b.updated_at || b.created_at || 0) as any).getTime();
          return tb - ta; // most recent first
        });
        setConversations(sorted);
        setError(null);
        // Prefetch partner user infos for labels
        const uniquePartnerIds = Array.from(new Set(list.map((c) => (c.senderId === currentUserId ? c.receiverId : c.senderId))));
        const entries: [number, UserInfo][] = [];
        for (const pid of uniquePartnerIds) {
          try {
            const res = await getUserById(String(pid));
            const u = res?.user || res || { id: pid };
            entries.push([pid, { id: pid, username: u?.username, email: u?.email }]);
          } catch {
            entries.push([pid, { id: pid }]);
          }
        }
        if (!mounted) return;
        setUserCache((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
        // Load unread counts per conversation
        try {
          const map = await getUnreadCountsByConversation();
          if (!mounted) return;
          setUnreadMap(map);
        } catch (e) {
          console.error('Failed to load unread counts per conversation:', e);
        }
      } catch (err: any) {
        console.error('Failed to load conversations:', err);
        if (!mounted) return;
        const status = err?.response?.status;
        // Gracefully degrade to empty list on common failures
        if (status === 404 || status === 401) {
          setConversations([]);
          setError(null);
        } else {
          // Handle network or server errors by showing empty state instead of blocking UX
          setConversations([]);
          setError(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadConversations();
    return () => { mounted = false; };
  }, [currentUserId]);

  // Refresh unread counts when other parts of the app mark messages read
  useEffect(() => {
    const refreshCounts = async () => {
      try {
        const map = await getUnreadCountsByConversation();
        setUnreadMap(map);
      } catch (e) {
        console.error('Failed to refresh unread counts:', e);
      }
    };
    window.addEventListener('unreadChanged', refreshCounts as EventListener);
    return () => {
      window.removeEventListener('unreadChanged', refreshCounts as EventListener);
    };
  }, []);

  const title = useMemo(() => 'Messages', []);

  const handleMarkAllRead = async () => {
    try {
      const { markAllMessagesAsRead } = await import('@/app/api/messages');
      const res = await markAllMessagesAsRead();
      // Trigger global refresh for header and list badges
      window.dispatchEvent(new Event('unreadChanged'));
      // Refresh local per-conversation map
      const map = await getUnreadCountsByConversation();
      setUnreadMap(map);
    } catch (e) {
      console.error('Failed to mark all messages as read:', e);
    }
  };

  // Dialog lifecycle and send handler
  useEffect(() => {
    let mounted = true;
    const loadDialog = async () => {
      if (!dialogOpen || !selectedConversationId || !currentUserId) return;
      try {
        setDialogLoading(true);
        setDialogError(null);
        const msgRes = await getMessagesByConversation(selectedConversationId);
        const msgs: MessageItem[] = Array.isArray((msgRes as any)?.messages)
          ? (msgRes as any).messages
          : (Array.isArray(msgRes) ? (msgRes as any) : []);
        if (!mounted) return;
        setDialogMessages(msgs);

        let otherId: number | null = null;
        if (msgs.length > 0) {
          const m0 = msgs[0];
          otherId = m0.senderId === currentUserId ? m0.recipientId : m0.senderId;
        }
        if (!otherId) {
          const conv = conversations.find((c) => c.id === selectedConversationId);
          if (conv) otherId = conv.senderId === currentUserId ? conv.receiverId : conv.senderId;
        }
        setDialogPartnerId(otherId || null);

        if (otherId) {
          const cached = userCache[otherId];
          if (cached?.username || cached?.email) {
            setDialogPartnerLabel(cached.username || cached.email || `User #${otherId}`);
          } else {
            try {
              const ures = await getUserById(String(otherId));
              const u = (ures as any)?.user || ures;
              setDialogPartnerLabel(u?.username || u?.email || `User #${otherId}`);
            } catch {
              setDialogPartnerLabel(`User #${otherId}`);
            }
          }
        } else {
          setDialogPartnerLabel('');
        }
      } catch (err: any) {
        console.error('Failed to load conversation dialog:', err);
        if (mounted) setDialogError('Failed to load conversation. Please try again later');
      } finally {
        if (mounted) setDialogLoading(false);
      }
    };
    loadDialog();
    return () => { mounted = false; };
  }, [dialogOpen, selectedConversationId, currentUserId, conversations, userCache]);

  useEffect(() => {
    dialogBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogMessages.length]);

  useEffect(() => {
    if (!dialogOpen || !selectedConversationId || !currentUserId) return;
    const hasInbound = dialogMessages.some((m) => m.recipientId === currentUserId);
    if (!hasInbound) return;
    markConversationAsRead(selectedConversationId)
      .then(() => {
        setUnreadMap((prev) => ({ ...prev, [selectedConversationId]: 0 }));
        try { window.dispatchEvent(new Event('unreadChanged')); } catch {}
      })
      .catch((err) => console.error('Failed to mark conversation as read:', err));
  }, [dialogOpen, selectedConversationId, currentUserId, dialogMessages]);

  const sendInDialog = async () => {
    if (!dialogInput.trim() || !dialogPartnerId || !currentUserId || !selectedConversationId) return;
    const text = dialogInput.trim();
    try {
      const res = await createMessage({ receiverId: dialogPartnerId, content: text, conversationId: selectedConversationId, messageType: 'text' });
      const msg = (res as any)?.message || null;
      if (msg) setDialogMessages((prev) => [...prev, msg]);
      setDialogInput('');
      setConversations((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex((c) => c.id === selectedConversationId);
        if (idx >= 0) {
          const conv: any = { ...copy[idx] };
          conv.last_message_content = text;
          conv.last_message_updated_at = new Date().toISOString();
          copy[idx] = conv;
          const [item] = copy.splice(idx, 1);
          copy.unshift(item);
        }
        return copy;
      });
    } catch (err) {
      console.error('Send failed:', err);
      alert('Failed to send message. Please try again later');
    }
  };

  return (
    <>
      <Header isLoggedin={auth} />
      <main className="container mx-auto py-8 min-h-screen">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600 mb-6">View and continue your conversations.</p>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="h-9 px-3 rounded bg-gray-800 text-white text-sm hover:bg-gray-700"
            aria-label="Mark all messages as read"
          >
            Mark all as read
          </button>
        </div>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="grid gap-3" role="list" aria-label="Conversations">
            {conversations.length === 0 && (
              <div className="text-gray-700" role="status" aria-live="polite">You currently have no conversations.</div>
            )}
            {conversations.map((c, index) => {
              const partnerId = c.senderId === currentUserId ? c.receiverId : c.senderId;
              const partner = userCache[partnerId];
              const partnerLabel = partner?.username || partner?.email || `User #${partnerId}`;
              const unreadCount = unreadMap[c.id] || 0;
              const lastContent: string | undefined = (c as any).last_message_content;
              const lastTimeRaw: string | undefined = (c as any).last_message_updated_at || c.updated_at || c.created_at;
              const lastTime = lastTimeRaw ? new Date(lastTimeRaw).toLocaleString() : '';
              const preview = lastContent ? (lastContent.length > 80 ? `${lastContent.slice(0, 77)}...` : lastContent) : '';
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedConversationId(c.id); setDialogOpen(true); }}
                  className="w-full text-left rounded border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <span>{index + 1} - {partnerLabel}</span>
                          {unreadCount > 0 && (
                            <span
                              className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-2 rounded-full bg-red-600 text-white text-xs font-semibold"
                              aria-label={`${unreadCount} unread messages`}
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                        </div>
                        {preview && (
                          <div className="text-sm text-gray-600 mt-1" title={lastContent}>
                            {preview}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{lastTime}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {dialogOpen && selectedConversationId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="bg-white w-[90vw] max-w-[700px] rounded shadow-lg border border-gray-200">
              <div className="px-4 py-3 border-b flex items-center justify-between">
                <div className="font-semibold">
                  {(() => {
                    const idx = conversations.findIndex((x) => x.id === selectedConversationId);
                    const rank = idx >= 0 ? idx + 1 : '' as any;
                    return `${rank ? rank + ' - ' : ''}${dialogPartnerLabel || 'Conversation'}`;
                  })()}
                </div>
                <button
                  onClick={() => { setDialogOpen(false); setSelectedConversationId(null); setDialogMessages([]); setDialogInput(''); }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                  aria-label="Close conversation dialog"
                >
                  Close
                </button>
              </div>

              <div className="p-4 h-[60vh] overflow-y-auto">
                {dialogLoading && <div className="text-gray-500">Loading...</div>}
                {dialogError && <div className="text-red-600">{dialogError}</div>}
                {!dialogLoading && !dialogError && (
                  <div>
                    {dialogMessages.map((m) => {
                      const outgoing = m.senderId === currentUserId;
                      return (
                        <div key={m.id} className={`flex mb-2 ${outgoing ? 'justify-end' : 'justify-start'}`}>
                          <div className={`px-3 py-2 rounded max-w-[70%] ${outgoing ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                            <div className="text-[10px] opacity-70 mt-1">{m.updated_at ? new Date(m.updated_at).toLocaleString() : ''}</div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={dialogBottomRef} />
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-3 flex gap-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                  placeholder="Type a message..."
                  value={dialogInput}
                  onChange={(e) => setDialogInput(e.target.value)}
                />
                <button onClick={sendInDialog} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Send</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

function MessagesListPage() {
  return (
    <Provider store={store}>
      <MessagesListInner />
    </Provider>
  );
}

export default withAuth(MessagesListPage);