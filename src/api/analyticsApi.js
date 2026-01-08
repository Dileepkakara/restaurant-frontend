import api from './apiClient';

export async function getDashboardStats(restaurantId) {
    return api.get(`/api/analytics/dashboard/${restaurantId}`);
}

export async function getTopSellingItems(restaurantId) {
    return api.get(`/api/analytics/top-selling/${restaurantId}`);
}

export async function exportAnalyticsReport(restaurantId, startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    // For CSV downloads, we need to use fetch directly
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE}/api/analytics/export/${restaurantId}?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${api.getToken()}`,
            'Accept': 'text/csv'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to export report');
    }

    return response.text();
}

export default { getDashboardStats, getTopSellingItems, exportAnalyticsReport };