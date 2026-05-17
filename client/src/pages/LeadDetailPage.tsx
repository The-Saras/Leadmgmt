import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Lead } from "../types";
import { getLeadById } from "../api/leadApi";
import Navbar from "../components/Navbar";
import { StatusBadge, SourceBadge } from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import LeadForm from "../components/LeadForm";
import { ArrowLeft, Pencil } from "lucide-react";

const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchLead = async () => {
    try {
      const response = await getLeadById(id!);
      if (response.success && response.data) {
        setLead(response.data);
      }
    } catch {
      setError("Lead not found or failed to load.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const rowClass = "flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0";
  const labelClass = "text-sm text-gray-500 dark:text-gray-400";
  const valueClass = "text-sm font-medium text-gray-900 dark:text-white";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {isLoading ? (
          <div className="py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="py-20 text-center text-red-500">{error}</div>
        ) : lead ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {lead.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {lead.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>

            <div>
              <div className={rowClass}>
                <span className={labelClass}>Status</span>
                <StatusBadge status={lead.status} />
              </div>
              <div className={rowClass}>
                <span className={labelClass}>Source</span>
                <SourceBadge source={lead.source} />
              </div>
              <div className={rowClass}>
                <span className={labelClass}>Created By</span>
                <span className={valueClass}>{lead.createdBy?.name}</span>
              </div>
              <div className={rowClass}>
                <span className={labelClass}>Created At</span>
                <span className={valueClass}>
                  {new Date(lead.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Lead"
      >
        {lead && (
          <LeadForm
            lead={lead}
            onSuccess={() => { setIsEditOpen(false); fetchLead(); }}
            onCancel={() => setIsEditOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default LeadDetailPage;