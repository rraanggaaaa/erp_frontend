// Hanya field yang ada di response API
export interface Supplier {
  id: string;
  supplier_code: string;
  supplier_name: string;
  nickname?: string;
  status: "Active" | "In Progress" | "Blocked";
}

export interface SupplierStats {
  total: number;
  growth: number;
  newSuppliers: number;
  newGrowth: number;
  avgCost: string;
  costGrowth: number;
  blocked: number;
  blockedGrowth: number;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
}

export interface SupplierListResponse {
  items: Supplier[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
