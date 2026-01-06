import api from './apiClient';

export async function getMenuItems(restaurantId) {
    return api.get(`/api/customer/restaurant/${restaurantId}/menu`);
}

export async function getCategories(restaurantId) {
    return api.get(`/api/customer/restaurant/${restaurantId}/categories`);
}

export async function getRestaurant(restaurantId) {
    return api.get(`/api/customer/restaurant/${restaurantId}`);
}

export async function validateTable(restaurantId, tableId) {
    return api.get(`/api/customer/restaurant/${restaurantId}/table/${tableId}`);
}

export async function createOrder(restaurantId, orderData) {
    return api.post(`/api/customer/restaurant/${restaurantId}/order`, orderData, {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function getOrderStatus(orderId) {
    return api.get(`/api/customer/order/${orderId}/status`);
}

export default { getMenuItems, getCategories, getRestaurant, validateTable, createOrder, getOrderStatus };