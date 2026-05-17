import { useState, useEffect, useCallback } from "react";
import type { Lead, PaginationMeta, LeadFilters } from "../types";
import { getLeads } from "../api/leadApi";
import useDebounce from "./useDebounce";

const defaultFilters: LeadFilters = {
  status: "",
  source: "",
  search: "",
  sort: "latest",
  page: 1,
};

const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce only the search field
  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLeads({
        ...filters,
        search: debouncedSearch,
      });

      if (response.success && response.data) {
        setLeads(response.data);
        setPagination(response.pagination || null);
      }
    } catch (err) {
      setError("Failed to fetch leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  // Refetch whenever filters or debounced search changes
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateFilter = (key: keyof LeadFilters, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 whenever any filter except page changes
      page: key === "page" ? (value as number) : 1,
    }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return {
    leads,
    pagination,
    filters,
    isLoading,
    error,
    updateFilter,
    resetFilters,
    refetch: fetchLeads,
  };
};

export default useLeads;