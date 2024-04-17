import axios from 'axios';
import { apiUrl } from './';

axios.defaults.withCredentials = true;

// DONATION REQUESTS
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

export async function getDonationRequestByUserId(userId) {
    try {
        console.log(">> get donation request: ", userId);
        const response = await axios.get(`${apiUrl}/donationRequest/${userId}`);
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
        console.log(">> update donation request: ", requestData);
        const response = await axios.put(`${apiUrl}/donationRequest/${requestData}`);
        return response.data;
    } catch (error) {
        throw error;
    }   
}

export async function deleteDonationRequest(requestId) {
    try {
        console.log(">> delete donation request: ", requestId);
        const response = await axios.delete(`${apiUrl}/donationRequest/${requestId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// DONORS
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

// SEARCH
export async function findDonationRequestByBloodType(bloodType) {
    try {
        console.log(">> find donation request by blood type: ", bloodType);
        const response = await axios.get(`${apiUrl}/donationReq?bloodType=${bloodType}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function findDonationRequestByDate(date) {
    try {
        console.log(">> find donation request by date: ", date);
        const response = await axios.post(`${apiUrl}/donationReqByDate`, date);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function findDonationRequestByPriority(urgent) {
    try {
        console.log(">> find donation request by priority: ", urgent);
        const response = await axios.get(`${apiUrl}/donationReqByPriority/${urgent}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function findDonationRequestByLocation(location) {
    try {
        console.log(">> find donation request by location: ", location);
        const response = await axios.post(`${apiUrl}/donationReqByLocation`, location);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// REQUEST MANAGEMENT
export async function denyDonationRequest(requestId) {
    try {
        console.log(">> deny donation request: ", requestId);
        const response = await axios.post(`${apiUrl}/denyRequest`, requestId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function acceptDonationRequest(requestId) {
    try {
        console.log(">> accept donation request: ", requestId);
        const response = await axios.get(`${apiUrl}/acceptRequest/${requestId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function incrementViewCount(requestId) {
    try {
        console.log(">> increment view count: ", requestId);
        const response = await axios.get(`${apiUrl}/incrementView/${requestId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
