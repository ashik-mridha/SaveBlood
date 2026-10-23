"use client";

import { useState } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { formatDate, formatLocation, roleLabels } from "@/lib/utils";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/Table";
import { Input, Select } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import PageHeader from "@/components/dashboard/PageHeader";

const roleOptions = Object.entries(roleLabels).map(([key, label]) => ({ key, label }));
const statusOptions = [
  { key: "active", label: "Active" },
  { key: "blocked", label: "Blocked" },
];
const sortState = { newest: { key: "joined", dir: "desc" }, oldest: { key: "joined", dir: "asc" }, name: { key: "name", dir: "asc" } };

function UsersContent() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const query = usePaginatedQuery(api.getUsers, { extraParams: { search: debouncedSearch }, limit: 10 });

  const changeRole = async (row, role) => {
    try {
      await api.updateUserRole(row._id, role);
      toast.success(`${row.name} is now ${roleLabels[role]}.`);
      query.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleBlock = async () => {
    const status = target.status === "blocked" ? "active" : "blocked";
    setBusy(true);
    try {
      await api.updateUserStatus(target._id, status);
      toast.success(status === "blocked" ? "User blocked." : "User unblocked.");
      setTarget(null);
      query.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const onSortChange = (key) => query.setSort(key === "name" ? "name" : query.sort === "newest" ? "oldest" : "newest");

  const columns = [
    {
      key: "name",
      header: "User",
      sortKey: "name",
      render: (row) => (
        <div className="flex min-w-48 items-center gap-3">
          <Avatar name={row.name} src={row.avatar} size={36} />
          <div className="min-w-0">
            <p className="truncate font-semibold">{row.name}</p>
            <p className="truncate text-xs text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "bloodGroup", header: "Group", render: (row) => <Badge tone="solid">{row.bloodGroup}</Badge> },
    { key: "location", header: "Location", render: (row) => <span className="whitespace-nowrap">{formatLocation(row.district, row.upazila)}</span> },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <select
          aria-label={`Role for ${row.name}`}
          value={row.role}
          disabled={row._id === me.id || row._id === me._id}
          onChange={(event) => changeRole(row, event.target.value)}
          className="focus-ring h-9 rounded-lg border border-line bg-surface px-2 text-sm disabled:opacity-60"
        >
          {roleOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      ),
    },
    { key: "status", header: "Status", render: (row) => <Badge tone={row.status === "blocked" ? "red" : "green"}>{row.status === "blocked" ? "Blocked" : "Active"}</Badge> },
    { key: "joined", header: "Joined", sortKey: "joined", render: (row) => <span className="whitespace-nowrap">{formatDate(row.createdAt)}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (row) =>
        row._id === me._id ? null : (
          <Button size="sm" variant={row.status === "blocked" ? "outline" : "soft"} onClick={() => setTarget(row)}>
            {row.status === "blocked" ? <CheckCircle2 className="size-4" aria-hidden="true" /> : <Ban className="size-4" aria-hidden="true" />}
            {row.status === "blocked" ? "Unblock" : "Block"}
          </Button>
        ),
    },
  ];

  return (
    <div>
      <PageHeader title="Manage users" description="Review members, change roles and block accounts." />
      <Card>
        <div className="grid gap-4 border-b border-line p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or email" />
          <Select label="Role" value={query.filters.role || ""} onChange={(event) => query.setFilters({ role: event.target.value })} options={roleOptions} placeholder="All roles" />
          <Select label="Status" value={query.filters.status || ""} onChange={(event) => query.setFilters({ status: event.target.value })} options={statusOptions} placeholder="All statuses" />
        </div>
        <DataTable
          columns={columns}
          rows={query.items}
          loading={query.loading}
          sort={sortState[query.sort]}
          onSortChange={onSortChange}
          page={query.page}
          pages={query.pages}
          total={query.total}
          onPageChange={query.setPage}
          empty="No users match these filters."
        />
      </Card>

      <Modal
        open={Boolean(target)}
        onClose={() => setTarget(null)}
        title={target?.status === "blocked" ? "Unblock this user?" : "Block this user?"}
        description={target?.name}
        footer={
          <>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Cancel
            </Button>
            <Button variant={target?.status === "blocked" ? "primary" : "danger"} loading={busy} onClick={toggleBlock}>
              {target?.status === "blocked" ? "Unblock" : "Block"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          {target?.status === "blocked" ? "They will be able to log in and create requests again." : "Blocked users cannot log in or create donation requests."}
        </p>
      </Modal>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <UsersContent />
    </ProtectedRoute>
  );
}
