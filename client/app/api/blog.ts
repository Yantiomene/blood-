import axios from 'axios';

// Prefer NEXT_PUBLIC_API_URL, fallback to NEXT_PUBLIC_API_BASE_URL, then localhost:8000
const rawBase = process.env.NEXT_PUBLIC_API_URL
  || process.env.NEXT_PUBLIC_API_BASE_URL
  || 'http://localhost:2000/api';

// Normalize: strip trailing /api and trailing slash, then append /blogs
const apiBase = rawBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
const apiUrl = `${apiBase}/blogs`;

// Ensure cookies (JWT in cookie) are included for admin-only routes
axios.defaults.withCredentials = true;

export async function getBlogs() {
    try {
        console.log('>> Before making GET request');
        const response = await axios.get(`${apiUrl}/getBlogs`);
        console.log('>> getBlogs:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to get blogs:', error);
        throw error;
    }
}

export async function getBlogById(id: number) {
    try {
        const response = await axios.get(`${apiUrl}/getBlog/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to get blog ${id}:`, error);
        throw error;
    }
}

export async function createBlog(payload: { title: string; content: string; image?: string | null }) {
    try {
        const response = await axios.post(`${apiUrl}/create`, payload);
        return response.data;
    } catch (error) {
        console.error('Failed to create blog:', error);
        throw error;
    }
}

export async function updateBlog(id: number, payload: { title?: string; content?: string; image?: string | null }) {
    try {
        const response = await axios.put(`${apiUrl}/updateBlog/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Failed to update blog:', error);
        throw error;
    }
}

export async function deleteBlog(id: number) {
    try {
        const response = await axios.delete(`${apiUrl}/deleteBlog/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to delete blog:', error);
        throw error;
    }
}

// Persisted interactions
export async function likeBlog(id: number) {
  try {
    const response = await axios.post(`${apiUrl}/${id}/like`, {});
    return response.data; // { success, blog: { id, likes_count } }
  } catch (error) {
    console.error('Failed to like blog:', error);
    throw error;
  }
}

export async function getBlogComments(id: number) {
  try {
    const response = await axios.get(`${apiUrl}/${id}/comments`);
    return response.data; // { success, comments }
  } catch (error) {
    console.error('Failed to get comments:', error);
    throw error;
  }
}

export async function addBlogComment(id: number, content: string) {
  try {
    const response = await axios.post(`${apiUrl}/${id}/comments`, { content });
    return response.data; // { success, comment }
  } catch (error) {
    console.error('Failed to add comment:', error);
    throw error;
  }
}

// Create a reply comment by passing parentId
export async function addBlogReply(id: number, content: string, parentId: number) {
  try {
    const response = await axios.post(`${apiUrl}/${id}/comments`, { content, parentId });
    return response.data; // { success, comment }
  } catch (error) {
    console.error('Failed to add reply:', error);
    throw error;
  }
}

// Like a specific comment
export async function likeComment(blogId: number, commentId: number) {
  try {
    const response = await axios.post(`${apiUrl}/${blogId}/comments/${commentId}/like`, {});
    return response.data; // { success, comment: { id, likes_count } }
  } catch (error) {
    console.error('Failed to like comment:', error);
    throw error;
  }
}

export async function deleteBlogComment(id: number, commentId: number) {
  try {
    const response = await axios.delete(`${apiUrl}/${id}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete comment:', error);
    throw error;
  }
}

// Admin-only: generate blog content via AI (DeepSeek)
export async function generateBlogAI(id: number) {
  try {
    const response = await axios.post(`${apiUrl}/${id}/generate`, {});
    return response.data; // { success, blog, provider }
  } catch (error) {
    console.error('Failed to generate blog via AI:', error);
    throw error;
  }
}

// Admin-only: upload image via base64 JSON
export async function uploadBlogImageBase64(file: File) {
  const filename = file.name;
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  try {
    const response = await axios.post(`${apiUrl}/upload`, {
      imageBase64: dataUrl,
      filename,
    });
    return response.data as { success: boolean; url?: string };
  } catch (error) {
    console.error('Failed to upload image:', error);
    throw error;
  }
}