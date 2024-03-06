import axios from 'axios';
import { apiUrl } from './';

axios.defaults.withCredentials = true;

export async function getUsers() {
    try {
        const response = await axios.get(`${apiUrl}/users`);
        return { props: { data: response.data } };
    } catch (error) {
        console.error('Failed to get users:', error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        console.log(">> getting current user...");
        const response = await axios.get(`${apiUrl}/profile`, {
            withCredentials: true,
        });
        console.log(">> recieved current user: ", response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting user profile:', error.message);
        throw error;
    }
}

export async function login(credentials) {
    try {
        const response = await axios.post(`${apiUrl}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function register(user) {
    try {
        const response = await axios.post(`${apiUrl}/register`, user);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await axios.get(`${apiUrl}/logout`);
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

export async function updateProfile(user) {
    try {
        console.log(">> profile update: ", user);
        const response = await axios.put(`${apiUrl}/profile`, user)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function checkProtected() {
    try {
        const response = await axios.get(`${apiUrl}/protected`);
        return response.data;
    } catch (error) {
        console.error('Protected route error:', error);
        throw error;
    }
}
