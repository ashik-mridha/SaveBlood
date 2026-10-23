"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { formatDate } from "@/lib/utils";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/Table";
import { Input, Select } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import PageHeader from "@/components/dashboard/PageHeader";

const statusOptions = [
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "resolved", label: "Resolved" },
];
const statusTone = { new: "red", read: "amber", resolved: "green" };

function MessagesContent() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const query = usePaginatedQuery(api.getContactMessages, { extraParams: { search: debouncedSearch }, limit: 10 });

  const setStatus = async (message, status) => {
    try {
      const updated = await api.updateContactStatus(message._id, status);
      toast.success(`Marked as ${status}.`);
      setViewing((current) => (current?._id === message._id ? updated : current));
      query.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openMessage = (message) => {
    setViewing(message);
    if (message.status === "new") setStatus(message, "read");
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.deleteContactMessage(deleting._id);
      toast.success("Message deleted.");
      setDeleting(null);
      query.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: "from",
      header: "From",
      render: (row) => (
        <div className="min-w-40">
          <p className="font-semibold">{row.name}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    { key: "subject", header: "Subject", render: (row) => <span className="line-clamp-2 min-w-48">{row.subject}</span> },
    { key: "date", header: "Received", render: (row) => <span className="whitespace-nowrap">{formatDate(row.createdAt)}</span> },
    { key: "status", header: "Status", render: (row) => <Badge tone={statusTone[row.status]}>{row.status}</Badge> },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-1">
          <button type="button" onClick={() => openMessage(row)} aria-label={`Read message from ${row.name}`} className="focus-ring rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800">
            <Eye className="size-4" />
          </button>
          <button type="button" onClick={() => setDeleting(row)} aria-label={`Delete message from ${row.name}`} className="focus-ring rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40">
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Contact messages" description="Questions and feedback sent through the contact form." />
      <Card>
        <div className="grid gap-4 border-b border-line p-5 sm:grid-cols-2">
          <Input label="Search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email or subject" />
          <Select label="Status" value={query.filters.status || ""} onChange={(event) => query.setFilters({ status: event.target.value })} options={statusOptions} placeholder="All messages" />
        </div>
        <DataTable columns={columns} rows={query.items} loading={query.loading} page={query.page} pages={query.pages} total={query.total} onPageChange={query.setPage} empty="No messages yet." />
      </Card>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.subject || ""}
        description={viewing ? `${viewing.name} · ${viewing.email} · ${formatDate(viewing.createdAt)}` : undefined}
        footer={
          viewing && (
            <>
              <Button variant="outline" href={`mailto:${viewing.email}?subject=${encodeURIComponent(`Re: ${viewing.subject}`)}`}>
                Reply by email
              </Button>
              {viewing.status !== "resolved" && <Button onClick={() => setStatus(viewing, "resolved")}>Mark resolved</Button>}
            </>
          )
        }
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">{viewing?.message}</p>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this message?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={busy} onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">The message from {deleting?.name} will be permanently removed.</p>
      </Modal>
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <MessagesContent />
    </ProtectedRoute>
  );
}
