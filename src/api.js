const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (data && typeof data === 'object') {
      if (data.errors && typeof data.errors === 'object') {
        const firstErrorKey = Object.keys(data.errors)[0];
        const errorMsg = data.errors[firstErrorKey];
        throw new Error(errorMsg || data.message || 'Validation failed');
      }
      throw new Error(data.message || data.error || `HTTP error ${response.status}`);
    }
    throw new Error(data || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth API
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      }));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async verifyMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Dashboard API
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Faculty API
  async getFaculty({ query = '', department = '', designation = '' } = {}) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (department) params.append('department', department);
    if (designation) params.append('designation', designation);

    const url = `${API_BASE_URL}/faculty${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async getFacultyById(id) {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createFaculty(facultyData) {
    const res = await fetch(`${API_BASE_URL}/faculty`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(facultyData),
    });
    return handleResponse(res);
  },

  async updateFaculty(id, facultyData) {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(facultyData),
    });
    return handleResponse(res);
  },

  async deleteFaculty(id) {
    const res = await fetch(`${API_BASE_URL}/faculty/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Departments API
  async getDepartments() {
    const res = await fetch(`${API_BASE_URL}/departments`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async createDepartment(departmentData) {
    const res = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(departmentData),
    });
    return handleResponse(res);
  },

  async deleteDepartment(id) {
    const res = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
