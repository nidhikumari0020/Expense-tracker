import { api } from './api';

export const expenseService = {
  async getAll() {
    const data = await api.get('/api/expense/get');
    return Array.isArray(data) ? data : [];
  },

  async add(expenseData) {
    // Backend returns response under key 'data'
    const response = await api.post('/api/expense/add', expenseData);
    return response.data;
  },

  async update(id, expenseData) {
    return await api.put(`/api/expense/update/${id}`, expenseData);
  },

  async delete(id) {
    return await api.delete(`/api/expense/delete/${id}`);
  },

  async getOverview(range = 'monthly') {
    // Backend returns overview under key 'date' instead of 'data'
    const response = await api.get(`/api/expense/overview?range=${encodeURIComponent(range)}`);
    return response.date || response.data;
  },

  async downloadExcel() {
    const blob = await api.getBlob('/api/expense/downloadexcel');
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense_details_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
