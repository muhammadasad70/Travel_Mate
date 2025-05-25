
// import axios from 'axios';
// import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const api = axios.create({
//   baseURL: Platform.OS === 'web'
//     ? 'http://localhost:8080'
//     : 'http://192.168.110.149:8080',  // ✅ Your current IP
// });

// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from './config/env';

const baseURL = getBaseURL();

const api = axios.create({
  baseURL,
  timeout: 10000, // optional: 10 sec timeout
});

// Request Interceptor: Add Auth Token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response Interceptor (e.g., handle 401 globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can check error.response.status === 401 and logout user
    return Promise.reject(error);
  }
);

export default api;

