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
        const response = await axios.get(`${apiUrl}/profile`);
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
        localStorage.clear(); // insurance no. 2
        console.log(">> logging out...success");
        return response.data;
    } catch (error) {
        console.error('Logout error:', error.message);
        throw error;
    }
}

export async function updateProfile(user) {
    try {
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
        console.error('Protected route error:', error.message);
        throw error;
    }
}

export async function verifyEmail(code) {
    try {
        const response = await axios.get(`${apiUrl}/verifyEmail/${code}`);
        return response.data;
    } catch (error) {
        console.error('Error verifying email:', error);
        throw error;
    }
}

export async function requestNewToken(userEmail) {
    try {
        const response = await axios.post(`${apiUrl}/requestNewToken`, userEmail);
        return response.data;
    } catch (error) {
        console.error('Error requesting new token:', error);
        throw error;
    }
}
