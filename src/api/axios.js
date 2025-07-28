// src/api/axios.js
import axios from "axios";
import { supabase } from "../supabaseClient";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
});

apiClient.interceptors.request.use(
  (config) => {
    return supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { apiClient as default };
