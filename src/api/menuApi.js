import api from './apiClient';

export async function getMenuItems(restaurantId) {
  return api.get(`/api/menu-items/restaurant/${restaurantId}`);
}

export async function createMenuItem(restaurantId, data) {
  return api.post(`/api/menu-items/restaurant/${restaurantId}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function updateMenuItem(id, data) {
  return api.put(`/api/menu-items/${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function deleteMenuItem(id) {
  return api.delete(`/api/menu-items/${id}`);
}

export default {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};