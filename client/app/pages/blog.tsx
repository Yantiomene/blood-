"use client";

import Header from "../components/Header";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getBlogs } from '@/app/api/blog';

interface BlogItem {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  updated_at?: string;
}

export default function BlogLandingPage() {
    const auth = useSelector((state: any) => state.auth.isAuth);

    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <>
        <Header isLoggedin={auth} />
        <main className="container mx-auto py-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
            <p className="text-lg text-gray-600 mb-6">Latest updates and stories from our community.</p>

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
