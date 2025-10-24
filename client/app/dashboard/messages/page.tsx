"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';

import Header from '@/app/components/Header';
import withAuth from '@/app/components/authHOC';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '@/app/redux/store';
import { fetchCurrentUser } from '@/app/redux/userSlice';
import { getConversationsByUser, getUnreadCountsByConversation, getMessagesByConversation, createMessage, markConversationAsRead } from '@/app/api/messages';
import { getUserById } from '@/app/api/user';
import { useSearchParams } from 'next/navigation';
import { subscribeToUnreadUpdates, UnreadUpdate } from '@/app/utils/websocket';

import { updateMessage, deleteMessage } from '@/app/api/messages';
import { reactToMessage, uploadMessageFileBase64 } from "@/app/api/messages";
import { usePresence } from "@/app/utils/websocket";
import dynamic from 'next/dynamic'
import data from '@emoji-mart/data'
const Picker = dynamic(() => import('@emoji-mart/react'), { ssr: false })

interface ConversationItem { id: number; senderId: number; receiverId: number; updated_at?: string; created_at?: string; }
interface MessageItem { id: number; conversationId: number; senderId: number; recipientId: number; content: string; messageType?: string; updated_at?: string; created_at?: string; }
interface UserInfo { id: number; username?: string; email?: string; }

const MessagesListInner: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.isAuth);
  const currentUserId = useSelector((state: any) => state.user?.data?.id);
  const searchParams = useSearchParams();

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
  // Editing state for message modifications (sender-only within 5 minutes)
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const dialogBottomRef = useRef<HTMLDivElement | null>(null);
// Inserted presence and attachment hooks
const onlineIds = usePresence();
const fileInputRef = useRef<HTMLInputElement | null>(null);

// Emoji picker state and helpers
const EMOJI_OPTIONS = ['🙂','😀','❤️','😂','😮','😢','👏','🎉','🙏','👍','👎','😡'];
const [pickerMessageId, setPickerMessageId] = useState<number | null>(null);
const [showInputEmojiPicker, setShowInputEmojiPicker] = useState<boolean>(false);
const dialogInputRef = useRef<HTMLInputElement | null>(null);
// Track the user's selected reaction per message for display
const [selectedReactions, setSelectedReactions] = useState<Record<number, string | null>>({});

const openMessageEmojiPicker = (mid: number) => {
  setPickerMessageId((prev) => (prev === mid ? null : mid));
};

const onPickReaction = async (mid: number, emoji: string) => {
  await toggleReaction(mid, emoji);
  setPickerMessageId(null);
  setSelectedReactions((prev) => {
    const isSame = prev[mid] === emoji;
    return { ...prev, [mid]: isSame ? null : emoji };
  });
};

const toggleInputEmojiPicker = () => {
  setShowInputEmojiPicker((v) => !v);
};

const insertEmojiIntoDialogInput = (emoji: string) => {
  const el = dialogInputRef.current;
  if (!el) {
    setDialogInput((prev) => prev + emoji);
    setShowInputEmojiPicker(false);
    return;
  }
  const start = el.selectionStart ?? dialogInput.length;
  const end = el.selectionEnd ?? start;
  const prev = dialogInput;
  const next = prev.slice(0, start) + emoji + prev.slice(end);
  setDialogInput(next);
  setShowInputEmojiPicker(false);
  setTimeout(() => {
    const caret = start + emoji.length;
    el.focus();
    el.setSelectionRange(caret, caret);
  }, 0);
};
const toggleReaction = async (mid: number, emoji: string) => {
  try {
    await reactToMessage(mid, emoji);
    setDialogMessages((prev) => prev.map((m) => {
      if (m.id !== mid) return m;
      const meta: any = (m as any).metadata || {};
      const reactions: Record<string, number[]> = { ...(meta.reactions || {}) };
      const arr = Array.isArray(reactions[emoji]) ? [...reactions[emoji]] : [];
      const uid = Number(currentUserId);
      const idx = arr.indexOf(uid);
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(uid);
      reactions[emoji] = arr;
      return { ...(m as any), metadata: { ...(meta), reactions } } as any;
    }));
  } catch (e) {
    console.error('Failed to toggle reaction', e);
  }
};

const onAttachClick = () => {
  fileInputRef.current?.click();
};

const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !dialogPartnerId || !selectedConversationId) return;
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const { url } = await uploadMessageFileBase64(dataUrl, file.name);
    const res = await createMessage({
      receiverId: dialogPartnerId,
      content: url,
      conversationId: selectedConversationId,
      messageType: 'file',
    });
    const msg = (res as any)?.message || null;
    if (msg) setDialogMessages((prev) => [...prev, msg]);
    // bump conversation preview
    setConversations((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((c) => c.id === selectedConversationId);
      if (idx >= 0) {
        const conv: any = { ...copy[idx] };
        conv.last_message_content = `[file] ${file.name}`;
        conv.last_message_updated_at = new Date().toISOString();
        copy[idx] = conv;
        const [item] = copy.splice(idx, 1);
        copy.unshift(item);
      }
      return copy;
    });
  } catch (err) {
    console.error('Upload failed', err);
    alert('File upload failed. Please try again');
  } finally {
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
};

  // Helper: check if a message can be modified by current user within 5 minutes
  const canModifyMessage = (m: MessageItem): boolean => {
    if (!currentUserId) return false;
    if (m.senderId !== currentUserId) return false;
    const tsRaw: any = (m as any).created_at || (m as any).updated_at || null;
    if (!tsRaw) return false;
    const ts = new Date(tsRaw).getTime();
    const now = Date.now();
    return now - ts <= 5 * 60 * 1000; // 5 minutes
  };

  const startEditMessage = (m: MessageItem) => {
    if (!canModifyMessage(m)) return;
    setEditingMessageId(m.id);
    setEditText(m.content || '');
  };

  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  const saveEditMessage = async () => {
    if (!editingMessageId) return;
    const mid = editingMessageId;
    const current = dialogMessages.find((x) => x.id === mid);
    if (!current || !canModifyMessage(current)) {
      alert('Edit window expired. You can only edit within 5 minutes.');
      cancelEditMessage();
      return;
    }
    const text = editText.trim();
    if (!text) {
      alert('Message content cannot be empty');
      return;
    }
    try {
      const res = await updateMessage(mid, { content: text });
      const updated = (res as any)?.message || null;
      setDialogMessages((prev) => prev.map((x) => (x.id === mid ? { ...x, content: text, updated_at: (updated && updated.updated_at) || new Date().toISOString() } : x)));
      cancelEditMessage();
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to edit message');
    }
  };

  const deleteMessageInDialog = async (m: MessageItem) => {
    if (!canModifyMessage(m)) {
      alert('Delete window expired. You can only delete within 5 minutes.');
      return;
    }
    try {
      await deleteMessage(m.id);
      setDialogMessages((prev) => prev.filter((x) => x.id !== m.id));
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete message');
    }
  };

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

  useEffect(() => {
    const cidParam = searchParams?.get('conversationId');
    const cid = cidParam ? Number(cidParam) : null;
    if (cid && !selectedConversationId) {
      setSelectedConversationId(cid);
      setDialogOpen(true);
    }
  }, [searchParams, selectedConversationId]);

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

  // Subscribe to real-time unread count updates via WebSocket
  useEffect(() => {
    if (!currentUserId) return;

    const handleUnreadUpdate = (update: UnreadUpdate) => {
      console.log('Received unread update:', update);
      
      // Update local unread map
      if (update.allRead) {
        // All messages marked as read
        setUnreadMap({});
      } else {
        // Convert array to map format
        const newMap: Record<number, number> = {};
        update.unreadCounts.forEach(({ conversationId, count }) => {
          if (count > 0) {
            newMap[conversationId] = count;
          }
        });
        setUnreadMap(newMap);
      }
      
      // Also trigger the global unreadChanged event for other components (like header)
      window.dispatchEvent(new Event('unreadChanged'));
    };

    const unsubscribe = subscribeToUnreadUpdates(handleUnreadUpdate);
    
    return () => {
      unsubscribe();
    };
  }, [currentUserId]);

  const title = useMemo(() => 'Messages', []);
  // Add requestId from query for contextual header link
  const requestIdFromQuery = useMemo(() => {
    const ridParam = searchParams?.get('requestId');
    const rid = ridParam ? Number(ridParam) : null;
    return rid && Number.isFinite(rid) ? rid : null;
  }, [searchParams]);

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

  // Also mark-as-read when dialog opens if there are unread counts
  useEffect(() => {
    if (!dialogOpen || !selectedConversationId) return;
    const unread = unreadMap[selectedConversationId] || 0;
    if (unread <= 0) return;
    markConversationAsRead(selectedConversationId)
      .then(() => {
        setUnreadMap((prev) => ({ ...prev, [selectedConversationId]: 0 }));
        try { window.dispatchEvent(new Event('unreadChanged')); } catch {}
      })
      .catch((err) => console.error('Failed to mark conversation as read on open:', err));
  }, [dialogOpen, selectedConversationId, unreadMap]);

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" role="region" aria-label="Messages split view">
            {/* Left: Conversation list */}
            <div className="lg:col-span-1">
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
                      className={`w-full text-left rounded border border-gray-200 p-4 hover:bg-gray-50 ${selectedConversationId === c.id ? 'bg-gray-100' : ''}`}
                      aria-label={`Open conversation with ${partnerLabel}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              <span>{index + 1} - {partnerLabel}</span>
                              {onlineIds.includes(partnerId) && (
                                <span className="text-green-600 text-xs">online</span>
                              )}
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
            </div>

            {/* Right: Conversation panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded border border-gray-200">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <div className="font-semibold flex items-center gap-2">
                    <span>{(() => {
                      if (!selectedConversationId) return 'Conversation';
                      const idx = conversations.findIndex((x) => x.id === selectedConversationId);
                      const rank = idx >= 0 ? idx + 1 : '' as any;
                      return `${rank ? rank + ' - ' : ''}${dialogPartnerLabel || 'Conversation'}`;
                    })()}</span>
                    {dialogPartnerId && onlineIds.includes(dialogPartnerId) && (
                      <span className="text-green-600 text-xs">online</span>
                    )}
                    {requestIdFromQuery && (
                      <a
                        href={`/dashboard/donor-requests/${requestIdFromQuery}`}
                        className="text-xs text-blue-600 hover:underline"
                        target="_self"
                        rel="noopener"
                        aria-label="View original donation request"
                      >
                        View request
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => { setDialogOpen(false); setSelectedConversationId(null); setDialogMessages([]); setDialogInput(''); }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                    aria-label="Clear selected conversation"
                  >
                    Clear
                  </button>
                </div>

                <div className="p-4 h-[60vh] overflow-y-auto">
                  {!selectedConversationId && (
                    <div className="text-gray-600" role="status" aria-live="polite">Select a conversation to view messages.</div>
                  )}
                  {selectedConversationId && (
                    <>
                      {dialogLoading && <div className="text-gray-500">Loading...</div>}
                      {dialogError && <div className="text-red-600">{dialogError}</div>}
                      {!dialogLoading && !dialogError && (
                        <div>
                          {dialogMessages.map((m) => {
                            const outgoing = m.senderId === currentUserId;
                            const canModify = canModifyMessage(m);
                            const isEditing = editingMessageId === m.id;
                            return (
                              <div key={m.id} className={`flex mb-2 ${outgoing ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded max-w-[70%] ${outgoing ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                                  {!isEditing && (
                                    <>
                                      <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                                      <div className="text-[10px] opacity-70 mt-1 flex items-center gap-2">
                                        <span>{m.updated_at ? new Date(m.updated_at).toLocaleString() : ''}</span>
                                        {outgoing && canModify && (
                                          <span className="inline-flex items-center gap-2">
                                            <button
                                              className="text-[10px] underline"
                                              onClick={() => startEditMessage(m)}
                                              aria-label="Edit message"
                                            >Edit</button>
                                            <button
                                              className="text-[10px] underline"
                                              onClick={() => deleteMessageInDialog(m)}
                                              aria-label="Delete message"
                                            >Delete</button>
                                          </span>
                                        )}
                                      </div>
                                      <div className="mt-1 flex items-center gap-2">
                                        <button
                                          type="button"
                                          className="text-sm hover:opacity-80"
                                          onClick={() => openMessageEmojiPicker(m.id)}
                                          aria-label="React with emoji"
                                          title="React"
                                        >🙂</button>
                                        {(() => {
                                          const reactions: Record<string, number[]> = ((m as any)?.metadata?.reactions) || {};
                                          const defaultChosen = Object.keys(reactions).find((emo) => Array.isArray(reactions[emo]) && reactions[emo].includes(Number(currentUserId))) || null;
                                          const chosen = selectedReactions[m.id] ?? defaultChosen;
                                          if (!chosen) return null;
                                          const count = Array.isArray(reactions[chosen]) ? reactions[chosen].length : 0;
                                          return (
                                            <span className="text-sm inline-flex items-center">
                                              {chosen}
                                              <span className="ml-1 text-xs">{count}</span>
                                            </span>
                                          );
                                        })()}
                                      </div>
                                      {pickerMessageId === m.id && (
                                        <div className="mt-1 relative">
                                          <div className="absolute z-10 bg-white border border-gray-200 rounded shadow p-1">
                                            {/* Emoji Mart Picker for reactions */}
                                            <Picker
                                              data={data}
                                              onEmojiSelect={(emoji: any) => onPickReaction(m.id, emoji.native)}
                                              theme="light"
                                              navPosition="bottom"
                                              previewPosition="none"
                                              perLine={8}
                                              emojiSize={20}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {isEditing && (
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-black"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                      />
                                      <div className="flex items-center gap-2">
                                        <button
                                          className="h-7 px-2 rounded bg-white text-black border"
                                          onClick={saveEditMessage}
                                          aria-label="Save edit"
                                        >Save</button>
                                        <button
                                          className="h-7 px-2 rounded bg-white text-black border"
                                          onClick={cancelEditMessage}
                                          aria-label="Cancel edit"
                                        >Cancel</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          <div ref={dialogBottomRef} />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="border-t border-gray-200 p-3 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                    placeholder="Type a message..."
                    value={dialogInput}
                    onChange={(e) => setDialogInput(e.target.value)}
                    disabled={!selectedConversationId}
                    ref={dialogInputRef}
                  />
                  {showInputEmojiPicker && (
                    <div className="relative">
                      <div className="absolute right-0 z-10 bg-white border border-gray-200 rounded shadow p-1">
                        {/* Emoji Mart Picker for input insertion */}
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: any) => insertEmojiIntoDialogInput(emoji.native)}
                          theme="light"
                          navPosition="bottom"
                          previewPosition="none"
                          perLine={8}
                          emojiSize={20}
                        />
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    className="p-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center"
                    onClick={toggleInputEmojiPicker}
                    disabled={!selectedConversationId || dialogLoading}
                    aria-label="Insert emoji"
                    title="Insert emoji"
                  >😊</button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={onFileSelected}
                  />
                  <button
                    type="button"
                    className="p-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center"
                    onClick={onAttachClick}
                    disabled={!selectedConversationId || dialogLoading}
                    aria-label="Attach file"
                    title="Attach file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.9-9.9a3.5 3.5 0 015 5l-10.6 10.6a1.5 1.5 0 01-2.12-2.12l9.19-9.19" />
                    </svg>
                  </button>
                  <button onClick={sendInDialog} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" disabled={!selectedConversationId || dialogLoading}>Send</button>
                </div>
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