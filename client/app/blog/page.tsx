"use client";
import React, { useEffect, useState } from 'react';
import { getBlogs } from '../api/blog';

const BlogPage = () => {

    const [posts, setPosts] = useState<Blog[]>([]);
    const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

    // Fetch blog posts
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await getBlogs();
                const data = response.blogs.map((blog: Blog) => ({
                    ...blog,
                    truncatedContent: blog.content.substring(0, 10),
                }));
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchBlogs();

    }, []);
    

    const handleReadMoreClick = (postId: number) => {
        setExpandedPostId(postId);
    };

    return (
        <div>
            <main className="container mx-auto py-8">
                <h1 className="text-4xl font-bold mb-4">Blood+ blog</h1>
                <p className="text-lg text-gray-600">Learn more about blood donation</p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
                                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                                <img src={post.image} alt={`Image for ${post.title}`} className="mb-4" />
                                <p className="text-gray-600">
                                    {expandedPostId === post.id ? post.content : post.content.substring(0, 30)}
                                </p>
                                {post.content.length > 10 && (
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => handleReadMoreClick(post.id)} // Replace this with your logic
                                    >
                                        Read More
                                    </button>
                                )}
                            </div>
                        ))
                    ): (
                        <p>Loading...</p>
                    )}
                </div>
            </main>
            <footer className="bg-red-800 py-4">
                <div className="container mx-auto text-center text-white">
                    &copy;2024 Blood+ team. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default BlogPage;

interface Blog {
    id: number;
    title: string;
    content: string;
    image: string;
    truncatedContent: string;
}