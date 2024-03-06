import axios from 'axios';

import { blogUrl } from './';

export async function getBlogs() {
    try {
        console.log('>> Before making GET request');
        const response = await axios.get(`${blogUrl}/getBlogs`);
        console.log('>> getBlogs:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to get blogs:', error);
        throw error;
    }
}


export async function getBlogById(id) {
    try {
        console.log(">> getting blog at :", `${blogUrl}/getBlog/${id}`);
        const response = await axios.get(`${blogUrl}/getBlog/${id}`);
        console.log('>> getBlogById:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to get blog:', error);
        throw error;
    }
}