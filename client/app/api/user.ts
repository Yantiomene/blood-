import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

axios.defaults.withCredentials = true;

interface UserLogin {
    username: string;
    email: string;
    bloodType: string;
    // will add more properties as later
}

interface UserProfile {
    username: string;
    email: string;
    bloodType: string;
    isDonor: boolean;
    location: [number, number];
    contactNumber: string;
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

export async function register(user: UserLogin): Promise<any> {
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


export async function updateProfile(user: UserProfile): Promise<any> {
    try {
        console.log(">> profile: ", user);
        const response = await axios.put(`${apiUrl}/profile`, user)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function verifyEmail(token: string): Promise<any> {
    try {
      const response = await axios.get(`${apiUrl}/verifyEmail/${token}`);
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }
  
export async function checkProtected(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch (e) {
    return false;
  }
}
  