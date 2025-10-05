"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogById } from '@/app/api/blog';

interface BlogItem {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  updated_at?: string;
}

export default function BlogDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        if (mounted) setBlog(Array.isArray(data) ? data[0] : data);
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

  const handleLike = () => {
    setLikes((n) => n + 1);
  };

  const addComment = () => {
    const text = commentInput.trim();
    if (!text) return;
    setComments((prev) => [text, ...prev]);
    setCommentInput('');
  };

  if (loading) return <main className="container mx-auto py-8"><p>Loading…</p></main>;
  if (error) return <main className="container mx-auto py-8"><p className="text-red-600">{error}</p></main>;
  if (!blog) return <main className="container mx-auto py-8"><p>No blog found.</p></main>;

  return (
    <main className="container mx-auto py-8">
      <Link href="/pages/blog" className="text-sm text-gray-600 hover:text-gray-800">← Back to blogs</Link>
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
        <div className="prose max-w-none whitespace-pre-line">{blog.content}</div>

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
              {comments.map((c, idx) => (
                <li key={idx} className="border rounded p-3 bg-gray-50">{c}</li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}