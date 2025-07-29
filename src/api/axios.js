// src/api/axios.js
import axios from "axios";
import { supabase } from "../supabaseClient";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
});

const waitForSession = async (maxRetries = 10, delay = 100) => {
  for (let i = 0; i < maxRetries; i++) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      console.log(`Axios: Session found after ${i + 1} attempts`);
      return data.session;
    }
    console.log(`Axios: Session attempt ${i + 1} failed, retrying...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  console.error("Axios: No session found after maximum retries");
  return null;
};

apiClient.interceptors.request.use(
  async (config) => {
    console.log(
      `Axios Interceptor: Firing before request to ${config.method?.toUpperCase()} ${
        config.url
      }`
    );

    // First, try to get session immediately
    let { data } = await supabase.auth.getSession();
    let session = data.session;

    // If no session, wait a bit for it to be ready (handles race conditions)
    if (!session?.access_token) {
      console.log("Axios Interceptor: No immediate session, waiting...");
      session = await waitForSession();
    }

    if (session?.access_token) {
      console.log("Axios Interceptor: Token found, attaching to headers.");
      config.headers["Authorization"] = `Bearer ${session.access_token}`;

      // Debug: Log the first few characters of the token
      const tokenPreview = session.access_token.substring(0, 20) + "...";
      console.log(`Axios Interceptor: Token preview: ${tokenPreview}`);
    } else {
      console.warn(
        `Axios Interceptor: No session token found for ${config.method?.toUpperCase()} ${
          config.url
        }`
      );

      // Check if this is a request that requires authentication
      const publicEndpoints = ["/users/create", "/auth/", "/reset-password"];
      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (!isPublicEndpoint) {
        console.error(
          `Axios Interceptor: Authentication required for ${config.url} but no token available`
        );
        // You might want to redirect to login or show an error here
      }
    }

    return config;
  },
  (error) => {
    console.error("Axios Interceptor Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.error("Axios Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      message: error.response?.data?.message || error.message,
    });

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.warn("Axios: 401 Unauthorized - checking session status");

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.error("Axios: No active session found, user needs to login");
        // You might want to redirect to login page here
        // window.location.href = '/login';
      } else {
        console.error(
          "Axios: Session exists but request was unauthorized - possible token issue"
        );
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
