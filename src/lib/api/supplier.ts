import { apiClient } from "./client";
import {
  Supplier,
  SupplierListResponse,
  ApiResponse,
  SupplierStats,
} from "@/types/supplier";

// Normalize supplier data dari API
const normalizeSupplier = (item: any): Supplier => ({
  id: String(item.id || ""),
  supplier_code: String(item.supplier_code || ""),
  supplier_name: String(item.supplier_name || "Unnamed Supplier"),
  nickname: String(item.nickname || ""),
  status: (item.status as Supplier["status"]) || "Active",
});

// Normalize response dari API - PASTIKAN STRUKTURNYA SESUAI
const normalizeListResponse = (
  payload: any,
): ApiResponse<SupplierListResponse> => {
  console.log("🔄 Normalizing response:", payload);

  // Cek struktur response
  const data = payload?.data || payload || {};
  const items = Array.isArray(data?.items)
    ? data.items.map((item: any) => normalizeSupplier(item))
    : [];

  const pagination = data?.pagination || {};

  console.log("✅ Normalized items:", items);
  console.log("✅ Normalized pagination:", pagination);

  return {
    success: true,
    data: {
      items,
      pagination: {
        page: Number(pagination?.page || 1),
        limit: Number(pagination?.limit || 50),
        total: Number(pagination?.total || items.length),
      },
    },
  };
};

export const getSupplierStats = (suppliers: Supplier[]): SupplierStats => {
  const total = suppliers.length;
  const active = suppliers.filter((item) => item.status === "Active").length;
  const inProgress = suppliers.filter(
    (item) => item.status === "In Progress",
  ).length;
  const blocked = suppliers.filter((item) => item.status === "Blocked").length;

  const growth = total > 0 ? Math.round((active / total) * 100) : 0;
  const newGrowth = total > 0 ? Math.round((active / total) * 50) : 0;
  const costGrowth = total > 0 ? Math.round((active / total) * 30) : 0;
  const blockedGrowth = total > 0 ? Math.round((blocked / total) * 20) : 0;

  return {
    total,
    growth: Math.max(0, growth),
    newSuppliers: active,
    newGrowth: Math.max(0, newGrowth),
    avgCost: `Rp ${(total * 320.3).toLocaleString("id-ID")} Mn`,
    costGrowth: Math.max(0, costGrowth),
    blocked,
    blockedGrowth: Math.max(0, blockedGrowth),
  };
};

export const supplierApi = {
  getAll: async (params?: {
    limit?: number;
    page?: number;
    search?: string;
  }) => {
    try {
      console.log("📡 Fetching suppliers with params:", params);

      const response = await apiClient.get<any>("/suppliers", {
        params: {
          limit: params?.limit ?? 50,
          page: params?.page ?? 1,
          search: params?.search ?? "",
        },
      });

      console.log("📥 Raw API Response:", response);
      console.log("📥 Response data:", response.data);

      const payload = response?.data;

      if (!payload) {
        console.warn("⚠️ Empty response, returning empty array");
        return {
          success: true,
          data: {
            items: [],
            pagination: {
              page: params?.page || 1,
              limit: params?.limit || 50,
              total: 0,
            },
          },
        } as ApiResponse<SupplierListResponse>;
      }

      if (payload?.success === false) {
        throw new Error(String(payload?.message ?? "Failed to load suppliers"));
      }

      const result = normalizeListResponse(payload);
      console.log("✅ Final result:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Error in getAll:", error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const response = await apiClient.get<any>(`/suppliers/${id}`);
      const payload = response?.data;

      if (payload?.success === false) {
        throw new Error(String(payload?.message ?? "Supplier not found"));
      }

      const data = payload?.data || payload;
      return {
        success: true,
        data: normalizeSupplier(data),
      } as ApiResponse<Supplier>;
    } catch (error: any) {
      console.error(`Error fetching supplier ${id}:`, error);
      throw error;
    }
  },

  create: async (data: Partial<Supplier>) => {
    try {
      const payload = {
        supplier_name: data.supplier_name,
        supplier_code: data.supplier_code,
        nickname: data.nickname,
        status: data.status,
      };

      const response = await apiClient.post<any>("/suppliers", payload);
      const body = response?.data;

      if (body?.success === false) {
        throw new Error(String(body?.message ?? "Failed to create supplier"));
      }

      const createdData = body?.data || {};
      return {
        success: true,
        data: normalizeSupplier({
          ...data,
          id: String(createdData.id || data.id || ""),
          supplier_code: String(
            createdData.supplier_code || data.supplier_code || "",
          ),
        }),
        message: String(body?.message || ""),
      } as ApiResponse<Supplier>;
    } catch (error: any) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<Supplier>) => {
    try {
      console.log(`📡 Updating supplier ${id} with data:`, data);

      const payload = {
        supplier_name: data.supplier_name,
        nickname: data.nickname,
        status: data.status,
      };

      // Gunakan fetch langsung ke API route Next.js
      const response = await fetch(`/api/v1/suppliers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json();

      console.log("📥 Update response:", body);

      if (!response.ok) {
        throw new Error(body?.message || "Failed to update supplier");
      }

      return {
        success: true,
        data: normalizeSupplier({ id, ...data }),
        message: String(body?.message || ""),
      } as ApiResponse<Supplier>;
    } catch (error: any) {
      console.error(`❌ Error updating supplier ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      console.log(`📡 Deleting supplier ${id}`);

      const response = await fetch(`/api/v1/suppliers/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const body = await response.json();

      console.log("📥 Delete response:", body);

      if (!response.ok) {
        throw new Error(body?.message || "Failed to delete supplier");
      }

      return {
        success: true,
        data: undefined,
        message: String(body?.message || ""),
      } as ApiResponse<void>;
    } catch (error: any) {
      console.error(`❌ Error deleting supplier ${id}:`, error);
      throw error;
    }
  },
};
