"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import withAuth from '@/app/components/authHOC';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '@/app/redux/store';
import { fetchCurrentUser } from '@/app/redux/userSlice';
import { getConversationsByUser } from '@/app/api/messages';
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

  useEffect(() => {
    dispatch(fetchCurrentUser() as any);
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const loadConversations = async () => {
      if (!currentUserId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getConversationsByUser(currentUserId);
        const list: ConversationItem[] = Array.isArray(data?.conversations) ? data.conversations : (Array.isArray(data) ? data : []);
        if (!mounted) return;
        setConversations(list);
        // Prefetch partner user infos
        const uniquePartnerIds = Array.from(new Set(list.map((c) => (c.senderId === currentUserId ? c.receiverId : c.senderId))));
        const entries: [number, UserInfo][] = [];
        for (const pid of uniquePartnerIds) {
          try {
            const res = await getUserById(String(pid));
            const user = res?.user || res || { id: pid };
            entries.push([pid, { id: pid, username: user?.username, email: user?.email }]);
          } catch {
            entries.push([pid, { id: pid }]);
          }
        }
        if (!mounted) return;
        setUserCache((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
      } catch (err: any) {
        console.error('Failed to load conversations:', err);
        if (mounted) setError('Failed to load conversations. Please try again later');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadConversations();
    return () => { mounted = false; };
  }, [currentUserId]);

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
              return (
                <Link key={c.id} href={`/dashboard/messages/${c.id}`} className="block rounded border border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Conversation: {partnerLabel}</div>
                      <div className="text-sm text-gray-600">Conversation ID: {c.id}</div>
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