"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import withAuth from '@/app/components/authHOC';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '@/app/redux/store';
import { fetchCurrentUser } from '@/app/redux/userSlice';
import { getConversationsByUser, getUnreadCountsByConversation } from '@/app/api/messages';
import { getUserById } from '@/app/api/user';

interface ConversationItem { id: number; senderId: number; receiverId: number; updated_at?: string; created_at?: string; }
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
        setConversations(list);
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

  return (
    <>
      <Header isLoggedin={auth} />
      <main className="container mx-auto py-8 min-h-screen">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">View and continue your conversations.</p>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="grid gap-3">
            {conversations.length === 0 && (
              <div className="text-gray-700">You currently have no conversations.</div>
            )}
            {conversations.map((c) => {
              const partnerId = c.senderId === currentUserId ? c.receiverId : c.senderId;
              const partner = userCache[partnerId];
              const partnerLabel = partner?.username || partner?.email || `User #${partnerId}`;
              const unreadCount = unreadMap[c.id] || 0;
              return (
                <Link key={c.id} href={`/dashboard/messages/${c.id}`} className="block rounded border border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-semibold">Conversation: {partnerLabel}</div>
                        <div className="text-sm text-gray-600">Conversation ID: {c.id}</div>
                      </div>
                      {unreadCount > 0 && (
                        <span
                          className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-2 rounded-full bg-red-600 text-white text-xs font-semibold"
                          aria-label={`${unreadCount} unread messages`}
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{c.updated_at ? new Date(c.updated_at).toLocaleString() : ''}</div>
                  </div>
                </Link>
              );
            })}
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