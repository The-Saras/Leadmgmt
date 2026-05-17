// Auth
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "sales";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Leads
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface CreateLeadBody {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadBody extends Partial<CreateLeadBody> {}

// Pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
}

// Filters
export interface LeadFilters {
  status: string;
  source: string;
  search: string;
  sort: "latest" | "oldest";
  page: number;
}