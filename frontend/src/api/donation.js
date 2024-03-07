import axios from 'axios';
import { apiUrl } from './';

axios.defaults.withCredentials = true;

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
        console.log("making donation request: ", requestData);
        const response = await axios.post(`${apiUrl}/donationRequest`, requestData);
        return response.data;
    } catch (error) {
        console.error('Donation request error:', error.message);
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

export async function findMatchingDonors(requestData) {
    try {
        console.log(">> finding donors: ", requestData);
        const response = await axios.post(`${apiUrl}/donors/find`, requestData);
        return response.data;
    } catch (error) {
        console.error('Error finding donors:', error.message);
        throw error;
    }
}
