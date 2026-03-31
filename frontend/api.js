/**
 * CampusConnect API Service
 * Handles all backend communication
 */

const API_BASE = 'http://localhost:5000/api';//127.0.0.1:5000/api'';

// ============ AUTH ============
const getToken = () => localStorage.getItem('cc_token');
const getUser = () => {
  const u = localStorage.getItem('cc_user');
  return u ? JSON.parse(u) : null;
};

const setAuth = (token, user) => {
  localStorage.setItem('cc_token', token);
  localStorage.setItem('cc_user', JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem('cc_token');
  localStorage.removeItem('cc_user');
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// ============ HTTP HELPERS ============
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const api = {
  // Auth
  register: (body) => fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(handleResponse),

  login: (body) => fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(handleResponse),

  getMe: () => fetch(`${API_BASE}/auth/me`, {
    headers: authHeaders()
  }).then(handleResponse),

  logout: () => fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: authHeaders()
  }).then(handleResponse),

  // Profile - Student
  createStudentProfile: (body) => fetch(`${API_BASE}/profile/student`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body)
  }).then(handleResponse),

  updateStudentProfile: (body) => fetch(`${API_BASE}/profile/student`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body)
  }).then(handleResponse),

  getStudentProfile: (id) => fetch(`${API_BASE}/profile/student/${id}`, {
    headers: authHeaders()
  }).then(handleResponse),

  // Profile - Alumni
  createAlumniProfile: (body) => fetch(`${API_BASE}/profile/alumni`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body)
  }).then(handleResponse),

  updateAlumniProfile: (body) => fetch(`${API_BASE}/profile/alumni`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(body)
  }).then(handleResponse),

  getAlumniProfile: (id) => fetch(`${API_BASE}/profile/alumni/${id}`, {
    headers: authHeaders()
  }).then(handleResponse),

  getAllProfiles: (role, page = 1, limit = 10) => fetch(`${API_BASE}/profile/all/${role}?page=${page}&limit=${limit}`, {
    headers: authHeaders()
  }).then(handleResponse),

  // Matching
  runMatching: (studentId) => fetch(`${API_BASE}/match/run`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ studentId })
  }).then(handleResponse),

  getStudentMatches: (id, page = 1, limit = 10) => fetch(`${API_BASE}/match/student/${id}?page=${page}&limit=${limit}`, {
    headers: authHeaders()
  }).then(handleResponse),

  getAlumniMatches: (id, page = 1, limit = 10) => fetch(`${API_BASE}/match/alumni/${id}?page=${page}&limit=${limit}`, {
    headers: authHeaders()
  }).then(handleResponse),

  // Connections
  sendConnection: (receiverId) => fetch(`${API_BASE}/connect/send`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ receiverId })
  }).then(handleResponse),

  acceptConnection: (id) => fetch(`${API_BASE}/connect/accept/${id}`, {
    method: 'PUT',
    headers: authHeaders()
  }).then(handleResponse),

  rejectConnection: (id) => fetch(`${API_BASE}/connect/reject/${id}`, {
    method: 'PUT',
    headers: authHeaders()
  }).then(handleResponse),

  getConnections: (status, page = 1, limit = 10) => fetch(
    `${API_BASE}/connect/list?${status ? `status=${status}&` : ''}page=${page}&limit=${limit}`, {
    headers: authHeaders()
  }).then(handleResponse),

  getPendingConnections: () => fetch(`${API_BASE}/connect/pending`, {
    headers: authHeaders()
  }).then(handleResponse),

  // Chat
  startChat: (receiverId) => fetch(`${API_BASE}/chat/start`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ receiverId })
  }).then(handleResponse),

  getChats: (page = 1, limit = 20) => fetch(`${API_BASE}/chat/list?page=${page}&limit=${limit}`, {
    headers: authHeaders()
  }).then(handleResponse),

  getChatMessages: (chatId, page = 1, limit = 30) => fetch(
    `${API_BASE}/chat/${chatId}/messages?page=${page}&limit=${limit}`, {
    headers: authHeaders()
  }).then(handleResponse),

  getUnreadCount: () => fetch(`${API_BASE}/chat/unread/count`, {
    headers: authHeaders()
  }).then(handleResponse),

  // Messages
  sendMessage: (chatId, receiverId, text) => fetch(`${API_BASE}/message/send`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ chatId, receiverId, text })
  }).then(handleResponse),

  markMessageRead: (id) => fetch(`${API_BASE}/message/${id}/read`, {
    method: 'PUT',
    headers: authHeaders()
  }).then(handleResponse),

  deleteMessage: (id) => fetch(`${API_BASE}/message/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  }).then(handleResponse),

  // Jobs
  createJob: (body) => fetch(`${API_BASE}/job/create`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body)
  }).then(handleResponse),

  getJobs: (status, page = 1, limit = 10) => fetch(
    `${API_BASE}/job/list?${status ? `status=${status}&` : ''}page=${page}&limit=${limit}`
  ).then(handleResponse),

  getJob: (id) => fetch(`${API_BASE}/job/${id}`).then(handleResponse),

  applyJob: (jobId) => fetch(`${API_BASE}/job/${jobId}/apply`, {
    method: 'POST',
    headers: authHeaders()
  }).then(handleResponse),

  getApplicants: (jobId) => fetch(`${API_BASE}/job/${jobId}/applicants`, {
    headers: authHeaders()
  }).then(handleResponse),

  updateApplicant: (jobId, studentId, status) => fetch(`${API_BASE}/job/${jobId}/applicants/${studentId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  }).then(handleResponse),

  // Health
  checkHealth: () => fetch(`${API_BASE}/health`).then(handleResponse),
};

// ============ AUTH GUARD ============
const requireAuth = () => {
  if (!getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
};

const requireGuest = () => {
  if (getToken()) {
    const user = getUser();
    window.location.href = 'dashboard.html';
    return false;
  }
  return true;
};

// ============ TOAST SYSTEM ============
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 4000) {
    this.init();
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-message">${message}</div>
    `;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success: (msg, d) => Toast.show(msg, 'success', d),
  error: (msg, d) => Toast.show(msg, 'error', d),
  info: (msg, d) => Toast.show(msg, 'info', d),
};

// ============ HELPERS ============
const Helpers = {
  initials: (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  timeAgo: (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  },

  formatDate: (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  }),

  scorePercent: (score, max = 800) => Math.min(100, Math.round((score / max) * 100)),

  scoreGrade: (percent) => {
    if (percent >= 80) return { label: 'Excellent', color: '#00d4aa' };
    if (percent >= 60) return { label: 'Good', color: '#6c63ff' };
    if (percent >= 40) return { label: 'Fair', color: '#f5a623' };
    return { label: 'Low', color: '#ff5c8d' };
  },

  debounce: (fn, delay) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  },
};

// ============ TAGS INPUT ============
class TagsInput {
  constructor(container, initialTags = []) {
    this.container = container;
    this.tags = [...initialTags];
    this.input = container.querySelector('input');
    this.render();
    this.bindEvents();
  }

  render() {
    const existing = this.container.querySelectorAll('.tag-chip');
    existing.forEach(el => el.remove());
    this.tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.innerHTML = `${tag}<button type="button" data-tag="${tag}">×</button>`;
      this.container.insertBefore(chip, this.input);
    });
  }

  bindEvents() {
    this.input.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && this.input.value.trim()) {
        e.preventDefault();
        this.add(this.input.value.trim().replace(/,$/, ''));
        this.input.value = '';
      }
      if (e.key === 'Backspace' && !this.input.value && this.tags.length) {
        this.remove(this.tags[this.tags.length - 1]);
      }
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.dataset.tag) this.remove(e.target.dataset.tag);
      else this.input.focus();
    });
  }

  add(tag) {
    const t = tag.toLowerCase().trim();
    if (t && !this.tags.includes(t)) {
      this.tags.push(t);
      this.render();
    }
  }

  remove(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.render();
  }

  getTags() { return [...this.tags]; }
}

// ============ MODAL MANAGER ============
const Modal = {
  open(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },
  close(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
  closeAll() {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
};

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) Modal.closeAll();
  if (e.target.dataset.modalClose) Modal.close(e.target.dataset.modalClose);
});