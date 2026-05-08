export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8081';
export const SPA_API_URL = import.meta.env.VITE_SPA_API_URL || 'http://localhost:8082';

async function request(baseUrl, path, options = {}) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
  };

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = data?.error || data?.message || 'No se pudo completar la solicitud';
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  register: (payload) => request(AUTH_API_URL, '/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request(AUTH_API_URL, '/auth/login', { method: 'POST', body: payload }),
  me: (token) => request(AUTH_API_URL, '/auth/me', { token })
};

export const spaApi = {
  services: () => request(SPA_API_URL, '/services'),
  service: (id) => request(SPA_API_URL, `/services/${id}`),
  createService: (payload, token) => request(SPA_API_URL, '/services', { method: 'POST', body: payload, token }),
  updateService: (id, payload, token) => request(SPA_API_URL, `/services/${id}`, { method: 'PUT', body: payload, token }),
  deleteService: (id, token) => request(SPA_API_URL, `/services/${id}`, { method: 'DELETE', token }),
  appointments: (token) => request(SPA_API_URL, '/appointments', { token }),
  myAppointments: (token) => request(SPA_API_URL, '/appointments/my', { token }),
  createAppointment: (payload, token) => request(SPA_API_URL, '/appointments', { method: 'POST', body: payload, token }),
  updateAppointmentStatus: (id, status, token) =>
    request(SPA_API_URL, `/appointments/${id}/status`, { method: 'PUT', body: { status }, token }),
  deleteAppointment: (id, token) => request(SPA_API_URL, `/appointments/${id}`, { method: 'DELETE', token })
};
