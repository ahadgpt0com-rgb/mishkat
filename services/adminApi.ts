
/**
 * Production-ready API service for Admin Dashboard
 */

// Use relative URL as both frontend and backend run on same internal network setup.
const BASE_URL = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token || ''
    };
};

const handleResponse = async (res: Response, endpoint: string) => {
    if (!res.ok) {
        console.error(`API Error [${endpoint}]:`, res.status, res.statusText, res.url);
        
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Server error: ${res.status}`);
        }
        
        // Handle 404 specifically
        if (res.status === 404) {
            throw new Error(`Endpoint not found (404) at ${res.url}. Ensure 'node server.js' is running on port 5001.`);
        }
        
        throw new Error(`Request failed with status ${res.status}`);
    }
    
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

export const adminApi = {
    login: async (credentials: any) => {
        try {
            const res = await fetch(`${BASE_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            return await handleResponse(res, 'login');
        } catch (error) {
            console.error("Login API error:", error);
            throw error;
        }
    },

    getStats: async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getHeaders() });
            return await handleResponse(res, 'getStats');
        } catch (e) {
            console.error("Get Stats error:", e);
            throw e;
        }
    },

    getRSVPs: async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/rsvps`, { headers: getHeaders() });
            return await handleResponse(res, 'getRSVPs');
        } catch (error) {
            console.error("Get RSVPs error:", error);
            throw error;
        }
    },

    deleteRSVP: async (id: string) => {
        try {
            const res = await fetch(`${BASE_URL}/admin/rsvps/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return await handleResponse(res, 'deleteRSVP');
        } catch (error) {
            console.error("Delete RSVP error:", error);
            throw error;
        }
    },

    getMedia: async () => {
        try {
            const res = await fetch(`${BASE_URL}/admin/media`, { headers: getHeaders() });
            return await handleResponse(res, 'getMedia');
        } catch (error) {
            console.error("Get Media error:", error);
            throw error;
        }
    },

    deleteMedia: async (filename: string) => {
        try {
            const res = await fetch(`${BASE_URL}/admin/media/${filename}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return await handleResponse(res, 'deleteMedia');
        } catch (error) {
            console.error("Delete Media error:", error);
            throw error;
        }
    },

    uploadFile: async (file: File, onProgress?: (p: number) => void) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('image', file);

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            });

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        reject(new Error('Invalid JSON response from server'));
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Network error. Check if server is running on port 5001.'));
            };
            
            xhr.open('POST', `${BASE_URL.replace('/api', '')}/api/upload`);
            xhr.setRequestHeader('Authorization', localStorage.getItem('admin_token') || '');
            xhr.send(formData);
        });
    }
};
