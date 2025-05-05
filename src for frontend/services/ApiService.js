import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from '../navigation/NavigationService';
import {Alert} from 'react-native';

// Base Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
});

// Request interceptor to add tokens to each request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expires, attempt to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const res = await axios.post('http://localhost:8080/auth/refresh', {
          refreshToken,
        });

        const { accessToken } = res.data;

        // Update token in AsyncStorage and retry the original request
        await AsyncStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        // Retry the failed request
        return api(originalRequest);
      } catch (refreshError) {
        console.log('Refresh token expired. Redirecting to login...');
        Alert.alert('Session expired', 'Please log in again.');
        await AsyncStorage.clear();

        // Redirect using navigation helper
        navigate('Login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
