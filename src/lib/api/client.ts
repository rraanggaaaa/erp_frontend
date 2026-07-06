import axios from "axios";
import { message } from "antd";

// Gunakan baseURL kosong untuk menggunakan Next.js API routes
const baseURL = "";

console.log("🔧 Environment:", process.env.NODE_ENV);
console.log("🔗 Base URL:", baseURL || "(Using Next.js API routes)");

export const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Pastikan URL dimulai dengan /api jika belum
    let url = config.url || "";

    // Jika URL tidak dimulai dengan http, https, atau /api, tambahkan /api
    if (!url.startsWith("http") && !url.startsWith("/api")) {
      url = `/api${url}`;
    }

    config.url = url;

    console.log(
      `📤 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`,
    );
    if (config.params && Object.keys(config.params).length > 0) {
      console.log("📤 Params:", config.params);
    }
    if (config.data) {
      console.log("📤 Data:", config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 [${response.status}] ${response.config.url}`);
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error("❌ Network Error:", error.message);
      message.error(
        "Unable to connect to server. Please check your connection.",
      );
      return Promise.reject(new Error("NETWORK_ERROR"));
    }

    const status = error.response.status;
    console.error(`❌ Server Error ${status}:`, error.response.data);

    if (status === 401) {
      message.error("Session expired. Please login again.");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    } else if (status === 403) {
      message.error("Access denied.");
    } else if (status === 404) {
      message.error("Resource not found.");
    } else if (status === 500) {
      message.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  },
);
