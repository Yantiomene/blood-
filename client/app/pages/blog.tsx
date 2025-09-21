"use client";

import Header from "../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/app/api/blog';
import { fetchCurrentUser } from '../redux/userSlice';

interface BlogItem {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  updated_at?: string;
}

export default function BlogLandingPage() {
    const dispatch = useDispatch();
    const auth = useSelector((state: any) => state.auth.isAuth);
    // Determine admin from env and current user email
    const userEmail: string = (useSelector((state: any) => state.user?.data?.email) || '').toLowerCase();
    const adminEmails: string[] = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    const isAdmin = adminEmails.includes(userEmail);

    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // Admin create form state
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [creating, setCreating] = useState<boolean>(false);
    const [form, setForm] = useState<{ title: string; content: string; image: string }>({ title: '', content: '', image: '' });

    useEffect(() => {
        // Load current user so we have email for admin gating
        dispatch(fetchCurrentUser() as any);
    }, [dispatch]);

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

    // Helpers for admin actions
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
            await createBlog({ title: form.title.trim(), content: form.content.trim(), image: form.image.trim() || null });
            await refreshBlogs();
            setForm({ title: '', content: '', image: '' });
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

    const handleEdit = async (b: BlogItem) => {
        const newTitle = prompt('Edit title', b.title);
        if (newTitle === null) return;
        const newContent = prompt('Edit content', b.content);
        if (newContent === null) return;
        try {
            await updateBlog(b.id, { title: newTitle, content: newContent });
            setBlogs((prev) => prev.map((x) => x.id === b.id ? { ...x, title: newTitle, content: newContent } : x));
        } catch (err) {
            console.error('Update failed', err);
            setError('Failed to update blog');
        }
    };

    return (
        <>
        <Header isLoggedin={auth} />
        <main className="container mx-auto py-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
            <p className="text-lg text-gray-600 mb-6">Latest updates and stories from our community.</p>

            {/* Admin Toolbar */}
            {isAdmin && (
              <section className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-red-800">Admin controls</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setShowCreate((v) => !v)} className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800">{showCreate ? 'Close' : 'New Post'}</button>
                    <button onClick={refreshBlogs} className="px-4 py-2 rounded border border-red-300 text-red-700 hover:bg-red-100">Refresh</button>
                  </div>
                </div>
                {showCreate && (
                  <form onSubmit={handleCreate} className="mt-4 grid gap-3">
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Title"
                      className="border rounded px-3 py-2"
                    />
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                      placeholder="Content"
                      className="border rounded px-3 py-2 min-h-[120px]"
                    />
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                      placeholder="Image URL (optional)"
                      className="border rounded px-3 py-2"
                    />
                    <div className="flex gap-2">
                      <button disabled={creating} type="submit" className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 disabled:opacity-60">{creating ? 'Creating…' : 'Create'}</button>
                      <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded border border-red-300 text-red-700 hover:bg-red-100">Cancel</button>
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
                    <p className="text-gray-700 line-clamp-4">{b.content}</p>
                    {b.updated_at && (
                      <p className="text-xs text-gray-400 mt-3">Updated: {new Date(b.updated_at).toLocaleString()}</p>
                    )}
                    {isAdmin && (
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => handleEdit(b)} className="px-3 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-50">Edit</button>
                        <button onClick={() => handleDelete(b.id)} className="px-3 py-1 rounded border border-red-300 text-red-700 hover:bg-red-50">Delete</button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
        </main>
        <footer className="bg-red-800 py-4">
            <div className="container mx-auto text-center text-white">
                &copy; 2024 My Blog. All rights reserved.
            </div>
        </footer>
        </>
    );
};
