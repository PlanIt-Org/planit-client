// src/api/axios.js
import axios from "axios";
import { supabase } from "../supabaseClient";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
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
