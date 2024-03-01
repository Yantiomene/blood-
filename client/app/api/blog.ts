import axios from 'axios';

const apiUrl = 'http://localhost:8000/blogs';

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