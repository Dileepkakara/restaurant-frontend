import api from './apiClient';

export async function getPendingRestaurants() {
  return api.get('/api/restaurants/pending');
}

export async function approveRestaurant(id) {
  return api.post(`/api/restaurants/${id}/approve`, JSON.stringify({}), { headers: { 'Content-Type': 'application/json' } });
}

export async function getApprovedRestaurants() {
  return api.get('/api/restaurants/approved');
}

export async function createRestaurant(data) {
  return api.post('/api/restaurants', data, { headers: { 'Content-Type': 'application/json' } });
}

export async function updateRestaurant(id, data) {
  return api.put(`/api/restaurants/${id}`, data, { headers: { 'Content-Type': 'application/json' } });
}

export async function deleteRestaurant(id) {
  return api.delete(`/api/restaurants/${id}`) || api.delete(`/api/restaurants/${id}`) ;
}

export default { getPendingRestaurants, approveRestaurant, getApprovedRestaurants, createRestaurant, updateRestaurant, deleteRestaurant };
