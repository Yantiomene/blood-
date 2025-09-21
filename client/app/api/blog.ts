import axios from 'axios';

const apiBase = (process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
  : 'http://localhost:5001');
const apiUrl = `${apiBase}/blogs`;

// Ensure cookies (if any permissions are enforced later) are included
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