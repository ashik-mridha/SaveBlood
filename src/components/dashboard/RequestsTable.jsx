"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate, formatLocation, formatStatus, formatTime, getUrgencyTone, urgencyLabels } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

const statusOptions = ["pending", "inprogress", "done", "canceled"];

// Table header key -> API sort value (clicking "created" toggles newest/oldest).
const sortValues = { created: "newest", urgency: "urgent", needed: "soon", bloodGroup: "bloodGroup", status: "status" };
const sortState = {
  newest: { key: "created", dir: "desc" },
  oldest: { key: "created", dir: "asc" },
  urgent: { key: "urgency", dir: "desc" },
  soon: { key: "needed", dir: "asc" },
  bloodGroup: { key: "bloodGroup", dir: "asc" },
  status: { key: "status", dir: "asc" },
};

export function toSortProps(sort, setSort) {
  return {
    sort: sortState[sort],
    onSortChange: (key) => setSort(key === "created" && sort === "newest" ? "oldest" : sortValues[key]),
  };
}

/** Requests table with View / Edit / Delete actions and inline status changes. */
export default function RequestsTable({ user, rows, loading, sort, onSortChange, page, pages, total, onPageChange, onChanged, readOnly = false }) {
  const toast = useToast();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const isAdmin = user.role === "admin";
  const canChangeStatus = (row) => isAdmin || user.role === "volunteer" || row.requesterId === user._id;
  const canEdit = (row) => isAdmin || row.requesterId === user._id;

  const changeStatus = async (row, status) => {
    try {
      await api.updateRequestStatus(row._id, status);
      toast.success("Request status updated.");
      onChanged();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.deleteRequest(pendingDelete._id);
      toast.success("Request deleted.");
      setPendingDelete(null);
      onChanged();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: "recipient",
      header: "Recipient",
      render: (row) => (
        <div className="min-w-40">
          <p className="font-semibold">{row.recipientName}</p>
          <p className="text-xs text-muted">{row.hospitalName}</p>
        </div>
      ),
    },
    { key: "bloodGroup", header: "Group", sortKey: "bloodGroup", render: (row) => <Badge tone="solid">{row.bloodGroup}</Badge> },
    { key: "location", header: "Location", render: (row) => <span className="whitespace-nowrap">{formatLocation(row.district, row.upazila)}</span> },
    {
      key: "needed",
      header: "Needed On",
      sortKey: "needed",
      render: (row) => (
        <span className="whitespace-nowrap">
          {formatDate(row.donationDate)} <span className="text-muted">{formatTime(row.donationTime)}</span>
        </span>
      ),
    },
    { key: "urgency", header: "Urgency", sortKey: "urgency", render: (row) => <Badge tone={getUrgencyTone(row.urgency)}>{urgencyLabels[row.urgency]}</Badge> },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      render: (row) =>
        !readOnly && canChangeStatus(row) ? (
          <select
            aria-label={`Status for ${row.recipientName}`}
            value={row.status}
            onChange={(event) => changeStatus(row, event.target.value)}
            className="focus-ring h-9 rounded-lg border border-line bg-surface px-2 text-sm"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
        ) : (
          <Badge tone="slate">{formatStatus(row.status)}</Badge>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/donation-requests/${row._id}`} aria-label={`View ${row.recipientName}`} className="focus-ring rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800">
            <Eye className="size-4" />
          </Link>
          {!readOnly && canEdit(row) && (
            <>
              <Link href={`/dashboard/requests/${row._id}/edit`} aria-label={`Edit ${row.recipientName}`} className="focus-ring rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800">
                <Pencil className="size-4" />
              </Link>
              <button type="button" onClick={() => setPendingDelete(row)} aria-label={`Delete ${row.recipientName}`} className="focus-ring rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40">
                <Trash2 className="size-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        sort={sort}
        onSortChange={onSortChange}
        page={page}
        pages={pages}
        total={total}
        onPageChange={onPageChange}
        empty="No donation requests found."
      />
      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete this request?"
        description={pendingDelete ? `The request for ${pendingDelete.recipientName} will be permanently removed.` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} onClick={confirmDelete}>
              Delete request
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">This action cannot be undone.</p>
      </Modal>
    </>
  );
}
