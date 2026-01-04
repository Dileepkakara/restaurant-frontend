import api from './apiClient';

export async function listPlans() {
  return api.get('/api/subscriptions/public');
}

export async function listPlansAdmin() {
  return api.get('/api/subscriptions');
}

export async function createPlan(data) {
  return api.post('/api/subscriptions', data, { headers: { 'Content-Type': 'application/json' } });
}

export async function updatePlan(id, data) {
  return api.put(`/api/subscriptions/${id}`, data, { headers: { 'Content-Type': 'application/json' } });
}

export async function deletePlan(id) {
  return api.delete(`/api/subscriptions/${id}`);
}

export default { listPlans, listPlansAdmin, createPlan, updatePlan, deletePlan };
