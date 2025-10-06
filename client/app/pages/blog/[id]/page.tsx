"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Header from '@/app/components/Header';
import { getBlogById, likeBlog, getBlogComments, addBlogComment } from '@/app/api/blog';

interface BlogItem {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  updated_at?: string;
  likes_count?: number;
}

interface BlogComment {
  id: number;
  blog_id?: number;
  user_id?: number | null;
  content: string;
  created_at?: string;
}

export default function BlogDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const auth = useSelector((state: any) => state.auth.isAuth);
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentInput, setCommentInput] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        const b: BlogItem = data?.blog ?? (Array.isArray(data) ? data[0] : data);
        if (mounted) {
          setBlog(b);
          setLikes(b?.likes_count || 0);
        }
        // Load comments
        const cdata = await getBlogComments(id);
        if (mounted) setComments(Array.isArray(cdata?.comments) ? cdata.comments : []);
      } catch (err) {
        console.error('Failed to load blog:', err);
        if (mounted) setError('Failed to load blog');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog?.title || 'Blog post';
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } else {
        prompt('Copy this link:', url);
      }
    } catch (e) {
      console.error('Share failed', e);
    }
  };

  const handleLike = async () => {
    try {
      const res = await likeBlog(id);
      const count = res?.blog?.likes_count ?? likes + 1;
      setLikes(count);
    } catch (e) {
      console.error('Like failed', e);
      // Fallback to optimistic update
      setLikes((n) => n + 1);
    }
  };

  const addComment = async () => {
    const text = commentInput.trim();
    if (!text) return;
    try {
      const res = await addBlogComment(id, text);
      const created: BlogComment = res?.comment || { id: Date.now(), content: text } as BlogComment;
      setComments((prev) => [created, ...prev]);
      setCommentInput('');
    } catch (e) {
      console.error('Add comment failed', e);
      alert('You need to be logged in to comment.');
    }
  };

  if (loading) return <>
    <Header isLoggedin={auth} />
    <main className="container mx-auto py-8"><p>Loading…</p></main>
  </>;
  if (error) return <>
    <Header isLoggedin={auth} />
    <main className="container mx-auto py-8"><p className="text-red-600">{error}</p></main>
  </>;
  if (!blog) return <>
    <Header isLoggedin={auth} />
    <main className="container mx-auto py-8"><p>No blog found.</p></main>
  </>;

  return (
    <>
      <Header isLoggedin={auth} />
      <main className="container mx-auto py-8">
      <Link href="/site/blog" className="text-sm text-gray-600 hover:text-gray-800">← Back to blogs</Link>
      <article className="mt-4 border rounded-lg p-6 shadow-sm bg-white">
        <h1 className="text-3xl font-bold mb-3">{blog.title}</h1>
        {blog.image && (
          <Image
            src={blog.image}
            alt={blog.title}
            width={800}
            height={360}
            className="w-full h-72 object-cover rounded mb-4"
            unoptimized={true}
          />
        )}
        {blog.updated_at && (
          <p className="text-xs text-gray-400 mb-4">Updated: {new Date(blog.updated_at).toLocaleString()}</p>
        )}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content || '' }}></div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleShare} className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50">Share</button>
          <button onClick={handleLike} className="px-3 py-2 rounded border border-red-300 text-red-700 hover:bg-red-50">Like ({likes})</button>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 border rounded px-3 py-2"
            />
            <button onClick={addComment} className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800">Post</button>
          </div>
          {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet. Be the first to share your thoughts.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="border rounded p-3 bg-gray-50">
                  <p>{c.content}</p>
                  {c.created_at && (
                    <p className="text-xs text-gray-400 mt-1">{new Date(c.created_at).toLocaleString()}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
    </>
  );
}