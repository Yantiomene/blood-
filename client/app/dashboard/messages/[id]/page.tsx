"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import withAuth from '@/app/components/authHOC';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '@/app/redux/store';
import { fetchCurrentUser } from '@/app/redux/userSlice';
import { createMessage, getConversationsByUser, getMessagesByConversation, markConversationAsRead } from '@/app/api/messages';
import { getUserById } from '@/app/api/user';

interface MessageItem { id: number; conversationId: number; senderId: number; recipientId: number; content: string; messageType?: string; updated_at?: string; created_at?: string; }
interface ConversationItem { id: number; senderId: number; receiverId: number; }

const ConversationInner: React.FC = () => {
  const params = useParams();
  const conversationId = Number(params?.id);
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.isAuth);
  const currentUserId = useSelector((state: any) => state.user?.data?.id);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [partnerLabel, setPartnerLabel] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [expandedImageIds, setExpandedImageIds] = useState<Record<number, boolean>>({});
  const toggleInlineImage = (id: number) => setExpandedImageIds(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => { dispatch(fetchCurrentUser() as any); }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const loadConversation = async () => {
      if (!conversationId || !currentUserId) return;
      try {
        setLoading(true);
        setError(null);
        const msgRes = await getMessagesByConversation(conversationId);
        let msgs: MessageItem[] = Array.isArray(msgRes?.messages) ? msgRes.messages : (Array.isArray(msgRes) ? msgRes : []);
        if (!mounted) return;
        setMessages(msgs);

        // Determine partnerId either via messages or conversations
        let otherId: number | null = null;
        if (msgs.length > 0) {
          const m0 = msgs[0];
          otherId = m0.senderId === currentUserId ? m0.recipientId : m0.senderId;
        }
        if (!otherId) {
          const convRes = await getConversationsByUser(currentUserId);
          const list: ConversationItem[] = Array.isArray(convRes?.conversations) ? convRes.conversations : (Array.isArray(convRes) ? convRes : []);
          const conv = list.find((c) => c.id === conversationId);
          if (conv) otherId = conv.senderId === currentUserId ? conv.receiverId : conv.senderId;
        }
        setPartnerId(otherId || null);

        // Prefetch partner label
        if (otherId) {
          try {
            const ures = await getUserById(String(otherId));
            const u = ures?.user || ures;
            setPartnerLabel(u?.username || u?.email || `User #${otherId}`);
          } catch {
            setPartnerLabel(`User #${otherId}`);
          }
        }
      } catch (err: any) {
        console.error('Failed to load conversation:', err);
        if (mounted) setError('Failed to load conversation. Please try again later');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadConversation();
    return () => { mounted = false; };
  }, [conversationId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;
    const hasInbound = messages.some((m) => m.recipientId === currentUserId);
    if (!hasInbound) return;
    markConversationAsRead(conversationId)
      .then(() => {
        try { window.dispatchEvent(new Event('unreadChanged')); } catch {}
      })
      .catch((err) => console.error('Failed to mark conversation as read:', err));
  }, [conversationId, currentUserId, messages]);



  const title = useMemo(() => partnerLabel ? `Conversation with ${partnerLabel}` : 'Conversation', [partnerLabel]);

  const send = async () => {
    if (!input.trim() || !partnerId || !currentUserId) return;
    try {
      const res = await createMessage({ receiverId: partnerId, content: input.trim(), conversationId, messageType: 'text' });
      const msg = res?.message || null;
      if (msg) setMessages((prev) => [...prev, msg]);
      setInput('');
    } catch (err) {
      console.error('Send failed:', err);
      alert('Failed to send message. Please try again later');
    }
  };

  return (
    <>
      <Header isLoggedin={auth} />
      <main className="container mx-auto py-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {loading && <div className="text-gray-500">加载中...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="bg-white rounded border border-gray-200 relative">
            <div className="p-4 h-[50vh] overflow-y-auto">
              {messages.map((m) => {
                const outgoing = m.senderId === currentUserId;
                return (
                  <div key={m.id} className={`flex mb-2 ${outgoing ? 'justify-end' : 'justify-start'}`}>
                    <div className={`px-3 py-2 rounded max-w-[70%] ${outgoing ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      <div className="text-sm">
                        {(() => {
                          const content = m.content || '';
                          const filename = content.split('/').pop() || 'file';
                          const baseRaw = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
                          const base = String(baseRaw).replace(/\/api\/?$/, '').replace(/\/$/, '');
                          const href = /^https?:\/\//i.test(content) ? content : `${base}${content.startsWith('/') ? content : '/' + content}`;
                          const isImage = /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(content);
                          const isFile = (m.messageType === 'file') || isImage || /\/uploads\//.test(content);
                          if (!isFile) {
                            return <div className="whitespace-pre-wrap">{content}</div>;
                          }
                          return (
                            <div className="space-y-1">
                              {isImage && (
                                <img
                                  src={href}
                                  alt={filename}
                                  className={`rounded border cursor-pointer ${expandedImageIds[m.id] ? 'w-full sm:max-w-[360px] md:max-w-[480px] lg:max-w-[640px] max-h-[60vh] object-contain' : 'max-w-[240px]'} `}
                                  onClick={() => toggleInlineImage(m.id)}
                                />
                              )}
                              <a
                                href={href}
                                download
                                className={`${outgoing ? 'text-white' : 'text-blue-600'} underline`}
                                title={isImage ? 'Download image' : `Download ${filename}`}
                              >
                                {isImage ? 'Download image' : `Download ${filename}`}
                              </a>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="text-[10px] opacity-70 mt-1">{m.updated_at ? new Date(m.updated_at).toLocaleString() : ''}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />

            </div>
            <div className="border-t border-gray-200 p-3 flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button onClick={send} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Send</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

function ConversationPage() {
  return (
    <Provider store={store}>
      <ConversationInner />
    </Provider>
  );
}

export default withAuth(ConversationPage);