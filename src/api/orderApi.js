import api from './apiClient';

export async function getOrders(restaurantId) {
    return api.get(`/api/orders/restaurant/${restaurantId}`);
}

export async function createOrder(restaurantId, orderData) {
    return api.post(`/api/orders/restaurant/${restaurantId}`, orderData, {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function updateOrderStatus(orderId, statusData) {
    return api.put(`/api/orders/${orderId}/status`, statusData, {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function getOrderById(orderId) {
    return api.get(`/api/orders/${orderId}`);
}

export default { getOrders, createOrder, updateOrderStatus, getOrderById };