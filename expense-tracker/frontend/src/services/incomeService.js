import { api } from './api';

export const incomeService = {
  async getAll() {
    const data = await api.get('/api/income/get');
    return Array.isArray(data) ? data : [];
  },

  async add(incomeData) {
    const response = await api.post('/api/income/add', incomeData);
    return response.income;
  },

  async update(id, incomeData) {
    const response = await api.put(`/api/income/update/${id}`, incomeData);
    return response.income;
  },

  async delete(id) {
    return await api.delete(`/api/income/delete/${id}`);
  },

  async getOverview(range = 'monthly') {
    const response = await api.get(`/api/income/overview?range=${encodeURIComponent(range)}`);
    return response.data;
  },

  async downloadExcel() {
    const blob = await api.getBlob('/api/income/downloadexcel');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income_details_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
