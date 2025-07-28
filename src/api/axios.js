// src/api/axios.js
import axios from "axios";
import { supabase } from "../supabaseClient";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
});

apiClient.interceptors.request.use(
  async (config) => {
    console.log("Axios Interceptor: Firing before request to", config.url);
    const data = await supabase.auth.getSession();
    const session = data.session;

    if (session?.access_token) {
      console.log("Axios Interceptor: Token found, attaching to headers."); // Debug: Confirm token is found
      config.headers["Authorization"] = `Bearer ${session.access_token}`;
    } else {
      console.warn("Axios Interceptor: No session token found."); // Debug: Warn if no token
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
