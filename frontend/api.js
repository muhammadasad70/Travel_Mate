

// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import getBaseURL from './config/env';

// const baseURL = getBaseURL(); // keep as-is (no /api) given your backend routes

// const api = axios.create({
//   baseURL,
//   timeout: 10000,
// });

// /** Allow app to register a global 401 handler (navigation redirect) */
// let onUnauthorized = null;
// export const setOnUnauthorized = (fn) => { onUnauthorized = fn; };

// // Request: attach token
// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response: normalize errors + handle 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const status = error?.response?.status;

//     // Normalize error
//     const msg =
//       error?.response?.data?.error ||
//       error?.response?.data?.message ||
//       error?.message ||
//       'Something went wrong';
//     error.userMessage = msg;

//     // Handle 401: clear session + redirect (once app registers a handler)
//     if (status === 401) {
//       try {
//         await AsyncStorage.multiRemove(['token', 'isLoggedIn', 'role', 'completed', 'userId']);
//       } catch {}
//       if (typeof onUnauthorized === 'function') {
//         onUnauthorized(); // e.g., navigate('Login')
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;



// api/index.js

// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getBaseURL from './config/env';

const baseURL = getBaseURL(); // e.g., http://localhost:8000

const api = axios.create({
  baseURL,
  timeout: 10000,
  // Don't set Content-Type here; we set it per-request in the interceptor.
  headers: { Accept: 'application/json' },
});

/** Global handlers you can wire up at app start:
 *   setOnUnauthorized(() => navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] }));
 *   setOnPrecondition(() => navigationRef.reset({ index: 0, routes: [{ name: 'ProfileCompletion' }] }));
 */
let onUnauthorized = null;
export const setOnUnauthorized = (fn) => { onUnauthorized = fn; };

let onPrecondition = null;
export const setOnPrecondition = (fn) => { onPrecondition = fn; };

/** Prevent multiple rapid 401 redirects */
let handling401 = false;

/** REQUEST INTERCEPTOR
 *  - Attach JWT
 *  - Set Content-Type intelligently (FormData vs JSON)
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // ignore storage read errors
    }

    // If sending FormData, let the runtime set the multipart boundary
    const isFormData =
      typeof FormData !== 'undefined' && config?.data instanceof FormData;

    if (isFormData) {
      if (config.headers && config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
    } else {
      // Default to JSON
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/** RESPONSE INTERCEPTOR
 *  - Normalize errors
 *  - Handle 428 (profile incomplete) → push to ProfileCompletion
 *  - Handle 401 (unauthorized) → clear session & push to Login
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    // Offline / CORS / Timeout → no response object
    if (!error.response) {
      error.userMessage =
        error?.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again.'
          : 'Network error. Check your connection or server.';
      return Promise.reject(error);
    }

    // Normalize server message
    const msg =
      error.response.data?.error ||
      error.response.data?.message ||
      `Request failed (${status})`;
    error.userMessage = msg;

    // 🔒 Profile incomplete → 428 Precondition Required
    if (status === 428) {
      if (typeof onPrecondition === 'function') onPrecondition();
      return Promise.reject(error);
    }

    // 🔑 Unauthorized → clear session once & redirect
    if (status === 401 && !handling401) {
      handling401 = true;
      try {
        await AsyncStorage.multiRemove([
          'token',
          'isLoggedIn',
          'role',
          'completed',
          'userId',
        ]);
      } catch {}
      if (typeof onUnauthorized === 'function') onUnauthorized();
      // small delay to allow nav to settle; then re-arm
      setTimeout(() => {
        handling401 = false;
      }, 800);
    }

    return Promise.reject(error);
  }
);

// Optional: help catch wrong baseURL in dev
if (__DEV__) {
  console.log('[API] Base URL:', baseURL);
}

export default api;
