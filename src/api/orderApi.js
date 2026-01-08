import api from './apiClient';

export async function getOrders(restaurantId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/api/orders/restaurant/${restaurantId}?${queryString}` : `/api/orders/restaurant/${restaurantId}`;
    return api.get(url);
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