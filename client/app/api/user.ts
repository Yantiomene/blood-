import axios from 'axios';

axios.defaults.withCredentials = true;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface User {
    username: string;
    email: string;
    bloodType: string;
    // will add more properties as later
}

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
        const response = await axios.get(`${apiUrl}/profile`);
        console.log('>> Getting Current User:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting user info:', error);
        throw error;
    }
}

export async function login(credentials: { email: string; password: string }): Promise<any> {
    try {
        const response = await axios.post(`${apiUrl}/login`, credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function register(user: User): Promise<any> {
    try {
        const response = await axios.post(`${apiUrl}/register`, user, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}


export async function logout(): Promise<any> {
    try {
        const response = await axios.get(`${apiUrl}/logout`);
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}