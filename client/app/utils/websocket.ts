import React from 'react';

export interface UnreadUpdate {
  totalUnread: number;
  unreadCounts: Array<{ conversationId: number; count: number }>;
  conversationId?: number;
  allRead?: boolean;
}

export type UnreadUpdateCallback = (update: UnreadUpdate) => void;

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private callbacks: Set<UnreadUpdateCallback> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private shouldReconnect = true;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    
    try {
      // Get JWT token from cookies
      const token = getCookie('token');
      if (!token) {
        console.warn('No authentication token found for WebSocket connection');
        this.isConnecting = false;
        return;
      }

      // Create WebSocket connection with token as query parameter
      const wsUrl = `ws://localhost:8000?token=${encodeURIComponent(token)}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // Subscribe to unread updates
        this.send({
          type: 'subscribe_unread'
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'unread_update') {
            // Notify all subscribers
            this.callbacks.forEach(callback => {
              try {
                callback(data.payload);
              } catch (error) {
                console.error('Error in unread update callback:', error);
              }
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.ws = null;
        
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
          
          setTimeout(() => {
            this.connect();
          }, delay);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.isConnecting = false;
    }
  }

  private send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  public subscribe(callback: UnreadUpdateCallback): () => void {
    this.callbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  public disconnect() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Send a ping to keep connection alive
  public ping() {
    this.send({ type: 'ping' });
  }
}

// Create singleton instance
let wsManager: WebSocketManager | null = null;

export function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager();
  }
  return wsManager;
}

// Hook for React components
export function useUnreadUpdates(callback: UnreadUpdateCallback) {
  const manager = getWebSocketManager();
  
  React.useEffect(() => {
    const unsubscribe = manager.subscribe(callback);
    return unsubscribe;
  }, [callback, manager]);
}

// For non-React usage
export function subscribeToUnreadUpdates(callback: UnreadUpdateCallback): () => void {
  const manager = getWebSocketManager();
  return manager.subscribe(callback);
}