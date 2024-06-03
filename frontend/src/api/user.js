import axios from "axios";
import { apiUrl } from "./";

axios.defaults.withCredentials = true;

export async function getUsers() {
  try {
    const response = await axios.get(`${apiUrl}/users`);
    return { props: { data: response.data } };
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await axios.get(`${apiUrl}/profile`);
    return response.data;
  } catch (error) {
    console.error("Error getting user profile:", error.message);
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const response = await axios.get(`${apiUrl}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user profile:", error.message);
    throw error;
  }
}

export async function login(credentials) {
  try {
    const response = await axios.post(`${apiUrl}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(user) {
  try {
    const response = await axios.post(`${apiUrl}/register`, user);
    return response.data;
  } catch (error) {
    console.error(">> Registration error:", error.response.data.errors[0]);
    throw error.response.data.errors[0];
  }
}

export async function logout() {
  try {
    const response = await axios.get(`${apiUrl}/logout`);
    console.log(">> logging out...success");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
}

export async function requestPasswordReset(userEmail) {
  try {
    const response = await axios.post(
      `${apiUrl}/passwordResetRequest`,
      userEmail
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function resetPasswordWithPIN(credentials) {
  try {
    const response = await axios.post(`${apiUrl}/passwordReset`, credentials);
    return response.data;
  } catch (error) {
    console.error("Password reset error", error.message);
    throw error;
  }
}

export async function updateProfile(user) {
  try {
    const response = await axios.put(`${apiUrl}/profile`, user);
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
    console.error("Protected route error:", error.message);
    throw error;
  }
}

export async function verifyEmail(code) {
  try {
    const response = await axios.get(`${apiUrl}/verifyEmail/${code}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
}

export async function requestNewToken(userEmail) {
  try {
    const response = await axios.post(`${apiUrl}/requestNewToken`, userEmail);
    return response.data;
  } catch (error) {
    console.error("Error requesting new token:", error);
    throw error;
  }
}
