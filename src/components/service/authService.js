import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { alert: 'Login failed' };
  }
};

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const checkDuplicateEmail = async (email) => {
  const response = await axios.get(`${API_URL}/users`, {
    params: { email },
  });
  return response.data.length > 0;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};