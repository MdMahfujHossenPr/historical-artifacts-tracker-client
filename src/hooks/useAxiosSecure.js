import axios from "axios";

import { getToken } from "../utils/token"; // আপনার token.js ফাইলের সঠিক পাথ দিন

const useAxiosSecure = () => {
  const instance = axios.create({
    baseURL: "https://historical-artifacts-tracker-server-apkyn6s0q.vercel.app",
  });

  // Request interceptor to add authorization token
  instance.interceptors.request.use(
    (config) => {
      // token.js থেকে getToken() ফাংশন ব্যবহার করে টোকেন আনুন
      const token = getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Request error handling
      return Promise.reject(error);
    }
  );

  // Optionally, you might want to add a response interceptor for error handling,
  // especially for 401/403 errors to log out the user or refresh the token.
  // instance.interceptors.response.use(
  //   (response) => response,
  //   async (error) => {
  //     const originalRequest = error.config;
  //     if (error.response.status === 401 || error.response.status === 403) {
  //       // Handle unauthorized or forbidden errors
  //       console.error('Unauthorized or Forbidden access. Logging out...');
  //       removeToken(); // token.js থেকে removeToken() ব্যবহার করুন
  //       // Redirect to login page or show a message
  //       // window.location.href = '/login';
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  return instance;
};

export default useAxiosSecure;
