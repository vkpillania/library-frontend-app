"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface MemberActionsProps {
  memberId: number;
  memberName: string;
  active: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8000/api/v1";

export default function MemberActions({
  memberId,
  memberName,
  active,
}: MemberActionsProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    const action = active ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} ${memberName}?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });

      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Unknown"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => setShowEditModal(true)}
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={handleToggleStatus}
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium rounded disabled:opacity-50 ${
            active
              ? "border border-red-300 text-red-700 hover:bg-red-50"
              : "border border-green-300 text-green-700 hover:bg-green-50"
          }`}
        >
          {loading ? "..." : active ? "Deactivate" : "Activate"}
        </button>
      </div>

      {showEditModal && (
        <EditMemberModal
          memberId={memberId}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            setShowEditModal(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function EditMemberModal({
  memberId,
  onClose,
  onSave,
}: {
  memberId: number;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Only send fields that have values (PATCH semantics)
    const payload: Record<string, string> = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value.trim()) payload[key] = value.trim();
    });

    if (Object.keys(payload).length === 0) {
      setError("Fill in at least one field to update");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Server returned ${res.status}`);
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold">Edit Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Leave a field blank to keep its current value.
          </p>

          <Field label="Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none"
            />
          </Field>

          <Field label="Phone">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none"
            />
          </Field>

          <Field label="Address">
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:outline-none"
            />
          </Field>

          {error && (
            <div className="border border-red-300 bg-red-50 text-red-700 text-sm p-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
