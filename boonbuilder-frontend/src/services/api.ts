import axios from 'axios';
import {
  God,
  Boon,
  Weapon,
  Familiar,
  Build,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  BuildTier,
  AvailableBoonsResponse,
  BoonPrerequisiteDetails
} from '../types';

// Configure axios with base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5291/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For cookie-based authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<AuthResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  checkAuth: async (): Promise<AuthResponse> => {
    const response = await api.get('/auth/check');
    return response.data;
  },
};

// Gods API
export const godsApi = {
  getAll: async (): Promise<God[]> => {
    const response = await api.get('/gods');
    return response.data;
  },

  getById: async (id: number): Promise<God> => {
    const response = await api.get(`/gods/${id}`);
    return response.data;
  },
};

// Boons API
export const boonsApi = {
  getAll: async (): Promise<Boon[]> => {
    const response = await api.get('/boons');
    return response.data;
  },

  getCore: async (): Promise<Boon[]> => {
    const response = await api.get('/boons/core');
    return response.data;
  },

  getDuo: async (): Promise<Boon[]> => {
    const response = await api.get('/boons/duo');
    return response.data;
  },

  getLegendary: async (): Promise<Boon[]> => {
    const response = await api.get('/boons/legendary');
    return response.data;
  },

  getByGod: async (godId: number): Promise<Boon[]> => {
    const response = await api.get(`/boons/god/${godId}`);
    return response.data;
  },

  getBySlot: async (slot: string): Promise<Boon[]> => {
    const response = await api.get(`/boons/slot/${slot}`);
    return response.data;
  },

  getAvailable: async (selectedBoonIds: number[]): Promise<AvailableBoonsResponse> => {
    const response = await api.post('/boons/available', selectedBoonIds);
    return response.data;
  },

  getPrerequisites: async (boonId: number): Promise<BoonPrerequisiteDetails> => {
    const response = await api.get(`/boons/prerequisites/${boonId}`);
    return response.data;
  },
};

// Weapons API
export const weaponsApi = {
  getAll: async (): Promise<Weapon[]> => {
    const response = await api.get('/weapons');
    return response.data;
  },

  getById: async (id: number): Promise<Weapon> => {
    const response = await api.get(`/weapons/${id}`);
    return response.data;
  },
};

// Familiars API
export const familiarsApi = {
  getAll: async (): Promise<Familiar[]> => {
    const response = await api.get('/familiars');
    return response.data;
  },

  getById: async (id: number): Promise<Familiar> => {
    const response = await api.get(`/familiars/${id}`);
    return response.data;
  },
};

// Builds API
export const buildsApi = {
  getAll: async (params?: {
    tier?: BuildTier;
    weaponId?: number;
    featured?: boolean;
  }): Promise<Build[]> => {
    const response = await api.get('/builds', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Build> => {
    const response = await api.get(`/builds/${id}`);
    return response.data;
  },

  create: async (build: {
    name: string;
    description: string;
    weaponAspectId: number;
    difficulty: number;
    tier: BuildTier;
    isPublic: boolean;
    playstyleTags?: string;
    boons?: Array<{
      boonId: number;
      slot?: number;
    }>;
  }): Promise<{ buildId: number; name: string }> => {
    const response = await api.post('/builds', build);
    return response.data;
  },

  update: async (id: number, build: {
    name: string;
    description: string;
    weaponAspectId: number;
    difficulty: number;
    tier: BuildTier;
    isPublic: boolean;
    playstyleTags?: string;
    boons?: Array<{
      boonId: number;
      slot?: number;
    }>;
  }): Promise<{ message: string }> => {
    const response = await api.put(`/builds/${id}`, build);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/builds/${id}`);
    return response.data;
  },

  getMyBuilds: async (): Promise<Build[]> => {
    const response = await api.get('/builds/user/me');
    return response.data;
  },

  getFavorites: async (): Promise<Build[]> => {
    const response = await api.get('/builds/favorites');
    return response.data;
  },

  addToFavorites: async (id: number): Promise<{ message: string }> => {
    const response = await api.post(`/builds/${id}/favorite`);
    return response.data;
  },

  removeFromFavorites: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/builds/${id}/favorite`);
    return response.data;
  },
};

export default api;