import api from "./index";
import type { ApiResponse, Lead, CreateLeadBody, UpdateLeadBody, LeadFilters } from "../types/index";

export const getLeads = async (
  filters: Partial<LeadFilters>
): Promise<ApiResponse<Lead[]>> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.status) params.append("status", filters.status);
  if (filters.source) params.append("source", filters.source);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);

  const { data } = await api.get(`/leads?${params.toString()}`);
  return data;
};

export const getLeadById = async (
  id: string
): Promise<ApiResponse<Lead>> => {
  const { data } = await api.get(`/leads/${id}`);
  return data;
};

export const createLead = async (
  body: CreateLeadBody
): Promise<ApiResponse<Lead>> => {
  const { data } = await api.post("/leads", body);
  return data;
};

export const updateLead = async (
  id: string,
  body: UpdateLeadBody
): Promise<ApiResponse<Lead>> => {
  const { data } = await api.put(`/leads/${id}`, body);
  return data;
};

export const deleteLead = async (id: string): Promise<ApiResponse<null>> => {
  const { data } = await api.delete(`/leads/${id}`);
  return data;
};

export const exportLeadsCSV = async (): Promise<void> => {
  const response = await api.get("/leads/export", {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};