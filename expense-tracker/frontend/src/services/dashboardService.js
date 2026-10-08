import { api } from './api';

export const dashboardService = {
  async getDashboardData() {
    const response = await api.get('/api/dashboard/data');
    return response.data;
  },

  async getMonthlyTrend(months = 6) {
    const response = await api.get(`/api/dashboard/monthly-trend?months=${months}`);
    return response.data;
  },
};
