import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

axios.defaults.withCredentials = true;

interface DonationRequest {
    bloodType: string;
    quantity: number;
    location: [number, number];
    message?: string;
    contactNumber?: string; // optional, may be embedded into message until backend supports field
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

export async function getDonationRequest(): Promise<any> {
    try {
        const response = await axios.get(`${apiUrl}/donationRequest`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        console.error('Error getting user donation:', error.message);
        throw error;
    }
}

export async function getDonationRequestByUserId(userId: string | number): Promise<any> {
    try {
        const response = await axios.get(`${apiUrl}/donationRequest/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        console.error('Error getting donation by user:', error.message);
        throw error;
    }
}

export async function makeDonationRequest(requestData: DonationRequest): Promise<any> {
    try {
        const response = await axios.post(`${apiUrl}/donationRequest`, requestData);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function updateDonationRequest(requestId: string, requestData: DonationRequest): Promise<any> {
    try {
        console.log('>> donation request: ', requestData);
        const response = await axios.put(`${apiUrl}/donationRequest/${requestId}`, requestData, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Accept a donation request (sends email to the requestor). Note: current backend does not persist acceptance state.
export async function acceptRequest(requestId: string | number): Promise<any> {
    try {
        const response = await axios.post(`${apiUrl}/acceptRequest/${requestId}`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error accepting request:', error);
        throw error;
    }
}

export async function denyRequest(requestId: string | number, reason: string): Promise<any> {
    try {
        const response = await axios.post(`${apiUrl}/denyRequest`, { requestId, reason }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error denying request:', error);
        throw error;
    }
}

export async function getDonationRequestById(requestId: string | number): Promise<any> {
    try {
        const response = await axios.get(`${apiUrl}/donationRequest/id/${requestId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error getting donation request by id:', error);
        throw error;
    }
}

export async function getDonationRequestsPaginated(params: { page?: number; limit?: number; isFulfilled?: boolean }): Promise<any> {
    const { page = 1, limit = 5, isFulfilled } = params || {};
    const query = new URLSearchParams();
    query.set('page', String(page));
    query.set('limit', String(limit));
    if (typeof isFulfilled !== 'undefined') query.set('isFulfilled', String(isFulfilled));

    try {
        const response = await axios.get(`${apiUrl}/donationRequest?${query.toString()}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        console.error('Error getting paginated donation requests:', error.message);
        throw error;
    }
}

export async function deleteDonationRequest(requestId: string | number): Promise<any> {
    try {
        const response = await axios.delete(`${apiUrl}/donationRequest/${requestId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error deleting donation request:', error);
        throw error;
    }
}