import axios from 'axios';

import { blogUrl } from './';

export async function getBlogs() {
    try {
        const response = await axios.get(`${blogUrl}/getBlogs`);
        return response.data;
    } catch (error) {
        console.error('Failed to get blogs:', error);
        throw error;
    }
}


export async function getBlogById(id) {
    try {
        const response = await axios.get(`${blogUrl}/getBlog/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to get blog:', error);
        throw error;
    }
}
