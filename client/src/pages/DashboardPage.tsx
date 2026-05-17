import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLeads from "../hooks/useLeads";
import Navbar from "../components/Navbar";
import { StatusBadge, SourceBadge } from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import Pagination from "../components/ui/Pagination";
import Modal from "../components/ui/Modal";
import LeadForm from "../components/LeadForm";
import { deleteLead, exportLeadsCSV } from "../api/leadApi";
import type { Lead } from "../types";
import {
  Search,
  Plus,
  Download,
  Trash2,
  Pencil,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

const DashboardPage = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const isAdmin = state.user?.role === "admin";

  const {
    leads,
    pagination,
    filters,
    isLoading,
    error,
    updateFilter,
    resetFilters,
    refetch,
  } = useLeads();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteLead(deleteId);
      setDeleteId(null);
      refetch();
    } catch {
      alert("Failed to delete lead");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportLeadsCSV();
    } catch {
      alert("Failed to export leads");
    } finally {
      setIsExporting(false);
    }
  };

  const selectClass = "px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Leads
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {pagination?.total ?? 0} total leads
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-60"
              >
                <Download size={16} />
                {isExporting ? "Exporting..." : "Export CSV"}
              </button>
            )}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <SlidersHorizontal size={16} className="text-gray-400" />

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className={selectClass}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Source filter */}
            <select
              value={filters.source}
              onChange={(e) => updateFilter("source", e.target.value)}
              className={selectClass}
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className={selectClass}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="py-20">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500 dark:text-red-400">
              {error}
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No leads found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Source</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Created</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-4 py-3">
                        <SourceBadge source={lead.source} />
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/leads/${lead._id}`)}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setEditLead(lead)}
                            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteId(lead._id)}
                              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              pagination={pagination}
              onPageChange={(p) => updateFilter("page", p)}
            />
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Lead"
      >
        <LeadForm
          onSuccess={() => { setIsCreateOpen(false); refetch(); }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
      >
        {editLead && (
          <LeadForm
            lead={editLead}
            onSuccess={() => { setEditLead(null); refetch(); }}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Lead"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this lead? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;