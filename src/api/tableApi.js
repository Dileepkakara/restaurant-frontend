import api from './apiClient';

export async function getTables(restaurantId) {
  return api.get(`/api/tables/restaurant/${restaurantId}`);
}

export async function createTable(restaurantId, data) {
  return api.post(`/api/tables/restaurant/${restaurantId}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function updateTable(id, data) {
  return api.put(`/api/tables/${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function deleteTable(id) {
  return api.delete(`/api/tables/${id}`);
}

export default {
  getTables,
  createTable,
  updateTable,
  deleteTable
};