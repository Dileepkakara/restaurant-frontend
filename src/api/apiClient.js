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
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      body,
      headers,
    });
  } catch (err) {
    // network error / CORS
    throw new Error('Network request failed: ' + (err.message || err));
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function get(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (!headers['Authorization'] && token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'GET', headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
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
    throw new Error('Network request failed: ' + (err.message || err));
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
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
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export default { post, get, put, delete: del };

