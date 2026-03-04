import { supabase } from './supabase';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
  private async getSessionToken(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const token = await this.getSessionToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(endpoint, config);

      if (response.status === 401) {
        // Token expired or invalid
        // Supabase client handles auto-refresh, but if it fails here, we might need to logout
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          await supabase.auth.signOut();
          window.location.href = '/admin/login';
          throw new Error('Session expired. Please login again.');
        }

        // Retry request with new token
        const newToken = await this.getSessionToken();
        if (newToken) {
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(endpoint, config);
          if (!retryResponse.ok) {
            throw new Error(`Request failed with status ${retryResponse.status}`);
          }
          return retryResponse.json();
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      // Return empty object for 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
