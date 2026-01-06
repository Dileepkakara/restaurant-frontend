const API_BASE = import.meta.env.VITE_API_URL || 'https://restaurant-backend-z2ga.onrender.com';

function getToken() {
  return localStorage.getItem('rb_token');
}

export async function post(path, body, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;

  // If Content-Type is JSON and body is an object, stringify it
  if ((headers['Content-Type'] || headers['content-type']) === 'application/json' && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      body,
      headers,
    });
  } catch (err) {
    // network error / CORS
    console.error('Network error:', err);
    throw new Error('Network connection failed. Please check your internet connection.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Handle specific error codes
    if (res.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('rb_token');
      localStorage.removeItem('rb_user');
      window.location.href = '/admin/login';
      throw new Error('Session expired. Please login again.');
    }
    if (res.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function get(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;
  
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { method: 'GET', headers });
  } catch (err) {
    console.error('Network error:', err);
    throw new Error('Network connection failed. Please check your internet connection.');
  }
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('rb_token');
      localStorage.removeItem('rb_user');
      window.location.href = '/admin/login';
      throw new Error('Session expired. Please login again.');
    }
    if (res.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function put(path, body, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;
  if ((headers['Content-Type'] || headers['content-type']) === 'application/json' && typeof body === 'object') {
    body = JSON.stringify(body);
  }
  
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { method: 'PUT', body, headers });
  } catch (err) {
    console.error('Network error:', err);
    throw new Error('Network connection failed. Please check your internet connection.');
  }
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('rb_token');
      localStorage.removeItem('rb_user');
      window.location.href = '/admin/login';
      throw new Error('Session expired. Please login again.');
    }
    if (res.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function del(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;
  
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers });
  } catch (err) {
    console.error('Network error:', err);
    throw new Error('Network connection failed. Please check your internet connection.');
  }
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('rb_token');
      localStorage.removeItem('rb_user');
      window.location.href = '/admin/login';
      throw new Error('Session expired. Please login again.');
    }
    if (res.status === 403) {
      throw new Error('Access denied. You do not have permission to perform this action.');
    }
    if (res.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export default { post, get, put, delete: del };

