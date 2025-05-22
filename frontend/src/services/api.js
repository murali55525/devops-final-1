import axios from 'axios';

// Use relative URL for API requests
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor with more detailed logging
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        console.log('Making request to:', config.url);
        console.log('Token exists:', !!token);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('Response received:', response.status);
        return response;
    },
    error => {
        console.error('Response error:', error.response?.status, error.response?.data);
        // If unauthorized, clear token
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log('Auth error detected, clearing token');
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: async (credentials) => {
        try {
            console.log('Attempting login with:', credentials.username);
            const response = await axios.post('/api/login', credentials);
            console.log('Login successful, token received');
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            console.error('Login failed:', error.response?.data);
            throw error;
        }
    },
    
    register: async (userData) => {
        console.log('Attempting registration for:', userData.username);
        const response = await axios.post('/api/register', userData);
        return response.data;
    },
    
    logout: () => {
        console.log('Logging out, clearing token');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    },
    
    // Add a token verification function
    verifyToken: async () => {
        try {
            const response = await api.get('/debug/auth');
            return response.data;
        } catch (error) {
            console.error('Token verification failed:', error.response?.data);
            throw error;
        }
    },
    
    // Add a test function
    testAPI: async () => {
        try {
            const response = await axios.get('/api/test');
            return response.data;
        } catch (error) {
            console.error('API test failed:', error);
            throw error;
        }
    }
};

// Todo services
export const todoService = {
    getAll: async () => {
        const response = await api.get('/todos');
        return response.data;
    },
    create: async (todo) => {
        const response = await api.post('/todos', todo);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/todos/${id}`);
    },
    update: async (id, data) => {
        const response = await api.put(`/todos/${id}`, data);
        return response.data;
    }
};

export default api;
