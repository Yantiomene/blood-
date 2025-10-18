import axios from 'axios';

// Prefer NEXT_PUBLIC_API_URL, fallback to NEXT_PUBLIC_API_BASE_URL, then localhost:8000/api
const rawApi = process.env.NEXT_PUBLIC_API_URL
  || process.env.NEXT_PUBLIC_API_BASE_URL
  || 'http://localhost:8000/api';
const apiUrl = rawApi.replace(/\/$/, '');

axios.defaults.withCredentials = true;

export interface MessageCreatePayload {
  receiverId: number;
  content: string;
  messageType?: string; // defaults to 'text'
  conversationId?: number;
  metadata?: any;
  event?: string;
}

export async function createMessage(payload: MessageCreatePayload): Promise<any> {
  try {
    const response = await axios.post(`${apiUrl}/createMessage`, payload, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to create message:', error);
    throw error;
  }
}

export async function getMessagesByConversation(conversationId: number | string): Promise<any> {
  try {
    const response = await axios.get(`${apiUrl}/messages/${conversationId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to get messages by conversation:', error);
    throw error;
  }
}

export async function getConversationsByUser(userId: number | string): Promise<any> {
  try {
    const response = await axios.get(`${apiUrl}/conversations/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to get conversations by user:', error);
    throw error;
  }
}

export async function getMessagesByUser(userId: number | string): Promise<any> {
  try {
    const response = await axios.get(`${apiUrl}/messages/user/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to get messages by user:', error);
    throw error;
  }
}

export async function updateMessage(messageId: number | string, payload: { content?: string; messageType?: string; status?: string; metadata?: any; event?: string; }): Promise<any> {
  try {
    const response = await axios.put(`${apiUrl}/updateMessage/${messageId}`, payload, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to update message:', error);
    throw error;
  }
}

export async function deleteMessage(messageId: number | string): Promise<any> {
  try {
    const response = await axios.delete(`${apiUrl}/deleteMessage/${messageId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Failed to delete message:', error);
    throw error;
  }
}