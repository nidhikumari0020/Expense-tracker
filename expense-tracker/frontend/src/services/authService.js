import { api } from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/api/users/login', credentials);
    return {
      token: response.token,
      user: {
        id: response.user?.id || response.user?._id,
        name: response.user?.name,
        email: response.user?.email,
      },
    };
  },

  async register(userData) {
    const response = await api.post('/api/users/register', userData);
    return {
      token: response.token,
      user: {
        id: response.user?.id || response.user?._id,
        name: response.user?.name,
        email: response.user?.email,
      },
    };
  },

  async getMe() {
    const response = await api.get('/api/users/me');
    return {
      id: response.user?.id || response.user?._id,
      name: response.user?.name,
      email: response.user?.email,
    };
  },

  async updateProfile(profileData) {
    const response = await api.put('/api/users/profile', profileData);
    return {
      id: response.user?.id || response.user?._id,
      name: response.user?.name,
      email: response.user?.email,
    };
  },

  async changePassword(passwordData) {
    return await api.put('/api/users/password', passwordData);
  },
};
