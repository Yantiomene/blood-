import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

axios.defaults.withCredentials = true;

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

export async function getCurrentUser(): Promise<any> {
    try {
        const response = await axios.get(`${apiUrl}/profile`, {
            withCredentials: true,
        });
        // console.log('>> Getting Current User:', response); // xx
        return response.data;
    } catch (error: any) {
        console.error('Error getting user profile:', error.message);
        throw error;
    }
}

export async function login(credentials: { email: string; password: string }): Promise<any> {
    try {
        const response = await axios.post(`${apiUrl}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function register(user: User): Promise<any> {
    try {
        const response = await axios.post(`${apiUrl}/register`, user);
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
