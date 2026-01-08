const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      body,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Network request failed: Request timeout (10s)');
    }
    // network error / CORS
    throw new Error('Network request failed: ' + (err.message || err));
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
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
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch(`${API_BASE}${path}`, { 
      method: 'GET', 
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        // Token expired or invalid, clear storage and redirect to login
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
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Network request failed: Request timeout (10s)');
    }
    throw new Error('Network request failed: ' + (err.message || err));
  }
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
    throw new Error('Network request failed: ' + (err.message || err));
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
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
    throw new Error('Network request failed: ' + (err.message || err));
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
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

