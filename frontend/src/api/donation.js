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

export async function getDonationRequest() {
    try {
        const response = await axios.get(`${apiUrl}/donationRequest`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error getting user donation:', error.message);
        throw error;
    }
}

export async function makeDonationRequest(requestData) {
    try {
        const response = await axios.post(`${apiUrl}/donationRequest`, requestData);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function updateDonationRequest(requestData) {
    try {
        console.log(">> donation request: ", requestData);
        const response = await axios.put(`${apiUrl}/donationRequest`, requestData)
        return response.data;
    } catch (error) {
        throw error;
    }
}
