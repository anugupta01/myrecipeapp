import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const USERS_URL = 'http://localhost:3030/users';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(USERS_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateEmail = async (email) => {
    try {
      const response = await axios.get(USERS_URL);
      const userExists = response.data.some((user) => user.email === email);
      return userExists;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };
  
  export const registerUser = async (userData) => {
    try {
      const response = await axios.post(USERS_URL, userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };
