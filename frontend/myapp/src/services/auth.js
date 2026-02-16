import API from './api';
import Cookies from 'js-cookie';

const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (email, password) => API.post('/auth/login', { email, password }),
  getCurrentUser: () => API.get('/auth/me'),
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    return API.post('/auth/logout');
  },
  setToken: (token) => Cookies.set('token', token, { expires: 7 }),
  getToken: () => Cookies.get('token'),
  isAuthenticated: () => !!Cookies.get('token'),
  setUser: (user) => Cookies.set('user', JSON.stringify(user), { expires: 7 }),
  getUser: () => {
    const user = Cookies.get('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;