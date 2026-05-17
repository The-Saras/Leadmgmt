import { useState } from "react";
import type { CreateLeadBody, Lead, LeadSource, LeadStatus } from "../types";
import { createLead, updateLead } from "../api/leadApi";

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];

const LeadForm = ({ lead, onSuccess, onCancel }: LeadFormProps) => {
  const [form, setForm] = useState<CreateLeadBody>({
    name: lead?.name || "",
    email: lead?.email || "",
    status: lead?.status || "New",
    source: lead?.source || "Website",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    if (!form.name.trim()) { setError("Name is required"); return false; }
    if (!form.email.trim()) { setError("Email is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email"); return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setError("");
    try {
      if (lead) {
        await updateLead(lead._id, form);
      } else {
        await createLead(form);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          placeholder="John Doe"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })} className={inputClass}>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
        <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })} className={inputClass}>
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={handleSubmit} disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          {isLoading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
        </button>
        <button onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LeadForm;