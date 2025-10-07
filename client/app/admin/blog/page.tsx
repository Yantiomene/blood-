"use client";

import Header from '@/app/components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBlogs, createBlog, updateBlog, deleteBlog, generateBlogAI, uploadBlogImageBase64 } from '@/app/api/blog';
import { generateContentFromTitle, stripHtml, formatAIContentToHtml, getBlogPreviewText } from '@/app/utils/generateBlogContent';
import { fetchCurrentUser } from '@/app/redux/userSlice';
import { Provider } from 'react-redux';
import store from '@/app/redux/store';

interface BlogItem {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  updated_at?: string;
}

export default function BlogAdminPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth.isAuth);
  const userEmail: string = (useSelector((state: any) => state.user?.data?.email) || '').toLowerCase();

  const adminEmails: string[] = useMemo(() => (
    (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  ), []);

  const isAdmin = useMemo(() => adminEmails.includes(userEmail), [adminEmails, userEmail]);

  // Removed server-side admin check that pointed to Next.js /api.
  // Admin gating relies on Redux user data and NEXT_PUBLIC_ADMIN_EMAILS.

  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [autoWritingId, setAutoWritingId] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [genProviderById, setGenProviderById] = useState<Record<number, string>>({});

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [form, setForm] = useState<{ title: string; content: string; image: string }>({ title: '', content: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; content: string; image?: string | null }>({ title: '', content: '', image: null });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Ensure we load current user data for admin gating
    dispatch(fetchCurrentUser() as any);
  }, [dispatch]);

  useEffect(() => {
    // If user is not admin (once email known), redirect to public blog page
    // We also handle the case where adminEmails may be empty and thus isAdmin is false
    if (userEmail && !isAdmin) {
      router.replace('/site/blog');
    }
  }, [userEmail, isAdmin, router]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getBlogs();
        const list = Array.isArray(data) ? data : (data?.blogs ?? []);
        if (mounted) setBlogs(list);
      } catch (err: any) {
        console.error('Failed to load blogs:', err);
        if (mounted) setError('Failed to load blogs');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const refreshBlogs = async () => {
    try {
      const data = await getBlogs();
      const list = Array.isArray(data) ? data : (data?.blogs ?? []);
      setBlogs(list);
    } catch (err) {
      console.error('Failed to refresh blogs:', err);
      setError('Failed to refresh blogs');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      let finalImageUrl: string | null = null;
      if (imageFile) {
        const uploadRes = await uploadBlogImageBase64(imageFile);
        if (!uploadRes?.success || !uploadRes.url) throw new Error('Image upload failed');
        finalImageUrl = uploadRes.url || null;
      } else if (form.image.trim()) {
        finalImageUrl = form.image.trim();
      }
      await createBlog({ title: form.title.trim(), content: form.content.trim(), image: finalImageUrl });
      await refreshBlogs();
      setForm({ title: '', content: '', image: '' });
      setImageFile(null);
      setShowCreate(false);
    } catch (err) {
      console.error('Create failed', err);
      setError('Failed to create blog');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      setError('Failed to delete blog');
    }
  };

  const beginEdit = (b: BlogItem) => {
    setEditingId(b.id);
    setEditForm({ title: b.title, content: b.content, image: b.image || null });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', content: '', image: null });
    setEditImageFile(null);
  };

  const saveEdit = async (b: BlogItem, imageFile?: File | null) => {
    try {
      setError(null);
      let finalImageUrl = editForm.image || null;
      if (imageFile) {
        const uploadRes = await uploadBlogImageBase64(imageFile);
        if (!uploadRes?.success || !uploadRes.url) throw new Error('Image upload failed');
        finalImageUrl = uploadRes.url || null;
      }
      await updateBlog(b.id, { title: editForm.title.trim(), content: editForm.content.trim(), image: finalImageUrl });
      await refreshBlogs();
      cancelEdit();
    } catch (err) {
      console.error('Update failed', err);
      setError('Failed to update blog');
    }
  };


  const handleAutoWrite = async (b: BlogItem) => {
    try {
      setError(null);
      setStatusMsg(null);
      setAutoWritingId(b.id);
      // Prefer backend AI generation (admin-only). Falls back to local generator on failure.
      try {
        const res = await generateBlogAI(b.id);
        const provider = res?.provider || 'unknown';
        const rawContent = res?.blog?.content || '';
        const formatted = formatAIContentToHtml(rawContent);
        if (formatted) {
          // persist formatted HTML
          await updateBlog(b.id, { content: formatted });
          setBlogs((prev) => prev.map((x) => x.id === b.id ? { ...x, content: formatted } : x));
          setGenProviderById((prev) => ({ ...prev, [b.id]: provider }));
          setStatusMsg(`Content generated via ${provider}.`);
          return;
        }
        // If backend returned but without content, fall through to local
        throw new Error('AI provider returned no content');
      } catch (aiErr) {
        console.warn('AI generation failed, falling back to local:', aiErr);
        const generated = generateContentFromTitle(b.title);
        const res = await updateBlog(b.id, { content: generated });
        const finalContent = res?.blog?.content || generated;
        setBlogs((prev) => prev.map((x) => x.id === b.id ? { ...x, content: finalContent } : x));
        setGenProviderById((prev) => ({ ...prev, [b.id]: 'local' }));
        setStatusMsg('Content generated via local fallback.');
      }
    } catch (err) {
      console.error('Auto-write failed', err);
      setError('Failed to auto-write content. Ensure you are logged in as admin.');
    } finally {
      setAutoWritingId(null);
    }
  };

  return (
    <Provider store={store}>
      <>
        <Header isLoggedin={auth} />
        <main className="container mx-auto py-8 min-h-screen">
          <h1 className="text-4xl font-bold mb-2">Blog Admin</h1>
          <p className="text-gray-600 mb-6">Create, edit, and manage blog posts.</p>

          {/* Only render admin controls if admin; otherwise blank (redirect happens above) */}
          {isAdmin && (
            <section className="bg-red-50 border border-red-200 rounded p-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-red-800">Admin controls</h2>
                <div className="flex gap-2">
                  <button onClick={() => setShowCreate((v) => !v)} className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800">{showCreate ? 'Close' : 'New Post'}</button>
                  <button onClick={refreshBlogs} className="px-4 py-2 rounded border border-red-300 text-red-700 hover:bg-red-100">Refresh</button>
                </div>
              </div>
              {statusMsg && (
                <div className="mt-3 p-2 rounded bg-blue-50 border border-blue-200 text-blue-800">
                  {statusMsg}
                </div>
              )}
              {showCreate && (
                <form onSubmit={handleCreate} className="mt-4 grid gap-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Title</span>
                    <input
                      type="text"
                      className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Enter blog title"
                      required
                    />
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Upload Image (optional)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Or Image URL</span>
                      <input
                        type="url"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        value={form.image}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Content</span>
                    <textarea
                      className="mt-1 w-full min-h-[140px] rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      value={form.content}
                      onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                      placeholder="Write your blog content here"
                      required
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 disabled:opacity-60"
                    >{creating ? 'Creating…' : 'Create Post'}</button>
                    <button
                      type="button"
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >Cancel</button>
                  </div>
                </form>
              )}
            </section>
          )}

          {loading && (
            <div className="text-gray-600">Loading blogs...</div>
          )}
          {error && (
            <div className="text-red-600">{error}</div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {blogs.length === 0 && (
                <div className="col-span-full text-gray-500">No blogs found.</div>
              )}
              {blogs.map((b) => (
                <article key={b.id} className="border rounded-lg p-4 shadow-sm bg-white">
                  <h2 className="text-xl font-semibold mb-2">{b.title}</h2>
                  {b.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.image} alt={b.title} className="w-full h-40 object-cover rounded mb-3" />
                  )}
                  {editingId === b.id ? (
                    <div className="mt-3 grid gap-3">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700">Title</span>
                        <input
                          type="text"
                          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                          value={editForm.title}
                          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700">Content</span>
                        <textarea
                          className="mt-1 w-full min-h-[120px] rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                          value={editForm.content}
                          onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                        />
                      </label>
                      <div className="grid md:grid-cols-2 gap-3">
                        <label className="block">
                          <span className="text-sm font-medium text-gray-700">Replace Image (optional)</span>
                          <input type="file" accept="image/*" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            onChange={(e) => setEditImageFile(e.target.files?.[0] || null)} />
                        </label>
                        <label className="block">
                          <span className="text-sm font-medium text-gray-700">Current/Alt Image URL</span>
                          <input type="url" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            value={editForm.image || ''}
                            onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))} />
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(b, editImageFile)}
                          className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-700"
                        >Save</button>
                        <button type="button" onClick={cancelEdit} className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 line-clamp-4">{getBlogPreviewText(b.content || '', b.title, 220)}</p>
                  )}
                  {b.updated_at && (
                    <p className="text-xs text-gray-400 mt-3">Updated: {new Date(b.updated_at).toLocaleString()}</p>
                  )}
                  {isAdmin && (
                    <div className="mt-3 flex gap-2">
                      {editingId === b.id ? null : (
                        <button onClick={() => beginEdit(b)} className="px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-50">Edit</button>
                      )}
                      <button onClick={() => handleDelete(b.id)} className="px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50">Delete</button>
                      <button
                        onClick={() => handleAutoWrite(b)}
                        disabled={autoWritingId === b.id}
                        className="px-3 py-1 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                      >
                        {autoWritingId === b.id ? 'Writing…' : 'Auto-write via AI'}
                      </button>
                      {genProviderById[b.id] && (
                        <span className="ml-2 px-2 py-1 text-xs rounded bg-gray-100 border border-gray-200 text-gray-600">{`provider: ${genProviderById[b.id]}`}</span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
        <footer className="bg-red-800 py-4">
          <div className="container mx-auto text-center text-white">
            &copy; 2024 Blog Admin. All rights reserved.
          </div>
        </footer>
      </>
    </Provider>
  );
}