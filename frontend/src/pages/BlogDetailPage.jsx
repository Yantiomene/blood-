import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogById } from '../api/blog';

const BlogDetailPage = () => {
  const { blogID } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlogById(blogID);
        setBlog(response.blog);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };

    fetchBlog();
  }, [blogID]);

  if (!blog) {
    return (
        <div
          className="rounded-lg mb-10 mx-auto bg-white text-center w-[80vw] h-[60vh] flex items-center justify-center"
        >
          Loading...
        </div>
    );
  }

  return (
    <>
      <div className='pt-10'>
        <section
          className="rounded-lg mb-10 mx-auto border-2 border-gray-300 w-[80vw] h-[60vh] bg-red-100 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${blog.image})` }}
        >
        </section>

      </div>

      <section className="p-10 px-[20%]">
        <h1 className="text-center text-5xl text-red-900 font-bold relative">
          {blog.title}
        </h1>

        <div className="text-sm font-bold text-red-700 py-4 my-4 px-8">
          <span className="inline-block bg-yellow-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            Created at: {new Date(blog.created_at).toLocaleDateString()}
          </span>
          <span className="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
            updated at: {new Date(blog.updated_at).toLocaleDateString()}
          </span>
        </div>

        <div className="min-h-[50vh] py-4 my-4 px-8 bg-white border border-gray-200 rounded-lg">
          <p>{blog.content}</p>
        </div>

      </section>
    </>
  );
};

export default BlogDetailPage;
