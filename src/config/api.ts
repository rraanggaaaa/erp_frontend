export const API_CONFIG = {
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://erp-backend-5ax6.vercel.app/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
};

export const ENDPOINTS = {
  suppliers: "/suppliers",
  supplier: (id: string) => `/suppliers/${id}`,
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
};
