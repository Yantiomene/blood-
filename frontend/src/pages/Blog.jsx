import React, { useEffect, useState } from "react";
// layouts
import WithHeader from "../layouts/withHeader";
// components
import BlogPostCard from "../components/blogCard";
// assets
import { blogImage } from "../assets";
// API
import { getBlogs } from "../api/blog";

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            const posts = await getBlogs();
            setBlogPosts(posts.blogs);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
            setIsLoading(false);
        }
    };

    return (
        <WithHeader>
            <section
                className="py-10 px-[10%] h-[80vh] bg-red-100 bg-cover bg-center bg-no-repeat bg-fixed relative flex items-center justify-center"
                style={{ backgroundImage: `url(${blogImage})` }}
            >
                <h1 className="text-center text-4xl text-white font-bold">
                    Learn more about blood donation and access.
                </h1>
            </section>
            <section className="p-10 bg-gray-100">
                <h2 className="text-3xl font-bold text-red-700 py-4 my-4 px-8 bg-gray-200 rounded">Our posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {isLoading ? (
                    <div
                        className="rounded-lg mb-10 mx-auto bg-white text-center w-[80vw] h-[60vh] flex items-center justify-center"
                    >
                        Loading...
                    </div>
                ) : (
                    blogPosts.map((post) => (
                        <BlogPostCard key={post.id} post={post} />
                    ))
                )}
                </div>
            </section>
        </WithHeader>
    );
};

export default BlogPage;
