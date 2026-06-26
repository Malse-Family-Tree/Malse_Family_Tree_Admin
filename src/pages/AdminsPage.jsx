import { useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { DataTable } from "@/components/DataTable";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
import { SearchSelect } from "@/components/SearchSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminMutations, useAdmins } from "@/hooks/useAdmins";
import { formatDate } from "@/utils";

const emptyAdmin = {
  name: "",
  email: "",
  password: "",
  role: "ADMIN",
  isActive: true,
};

function AdminFormModal({
  open,
  title,
  initialValues,
  isEditing,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}) {
  const [values, setValues] = useState(initialValues);

  if (!open) {
    return null;
  }

  const handleChange = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: values.name,
      email: values.email,
      role: values.role,
    };

    if (values.password) {
      payload.password = values.password;
    }

    if (isEditing) {
      payload.isActive = values.isActive;
    }

    await onSubmit(payload);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4 shrink-0">
          <CardTitle>{title}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <CardContent className="space-y-4 overflow-y-auto py-4">
            {errorMessage && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" value={values.name} onChange={handleChange("name")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input id="email" type="email" value={values.email} onChange={handleChange("email")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password
                {!isEditing && <span className="text-destructive ml-1">*</span>}
                {isEditing ? " (leave blank to keep current)" : ""}
              </Label>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange("password")}
                required={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <SearchSelect
                id="role"
                label="Role"
                value={values.role}
                onChange={(val) =>
                  setValues((current) => ({ ...current, role: val }))
                }
                options={[
                  { label: "Admin", value: "ADMIN" },
                  { label: "Super Admin", value: "SUPER_ADMIN" },
                ]}
                required
              />
            </div>

            {isEditing && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={handleChange("isActive")}
                />
                Active account
              </label>
            )}
          </CardContent>
          <CardFooter className="flex shrink-0 justify-end gap-2 border-t p-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Admin"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>,
    document.body
  );
}

export function AdminsPage() {
  const { data: admins = [], isLoading, isError } = useAdmins();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [bulkDeleteError, setBulkDeleteError] = useState("");
  const [formError, setFormError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  const { createAdmin, updateAdmin, deleteAdmin, bulkDeleteAdmins } = useAdminMutations();

  const handleBulkDelete = async (selectedIds, clearSelection) => {
    setBulkDeleteError("");
    try {
      await bulkDeleteAdmins.mutateAsync(selectedIds);
      clearSelection();
    } catch (error) {
      setBulkDeleteError(error.message || "Failed to delete selected admins.");
    }
  };

  const openCreate = () => {
    setEditingAdmin(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEdit = (admin) => {
    setEditingAdmin(admin);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingAdmin(null);
    setFormError("");
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingAdmin) {
        await updateAdmin.mutateAsync({ id: editingAdmin.id, payload });
      } else {
        await createAdmin.mutateAsync(payload);
      }
      closeForm();
    } catch (error) {
      setFormError(error.message || "Failed to save admin.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleteError("");

    try {
      await deleteAdmin.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(error.message || "Failed to delete admin.");
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (row) => row.role.replace("_", " "),
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (row.isActive ? "Active" : "Inactive"),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-32",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit admin">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(row)}
            aria-label="Delete admin"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admins"
        description="Manage administrator accounts. Super Admin access only."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        }
      />

      {bulkDeleteError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {bulkDeleteError}
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading admins..." />
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load admins. Super Admin access is required.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={admins}
          emptyTitle="No admins configured"
          emptyDescription="Create an admin account to manage the platform."
          onDeleteSelected={handleBulkDelete}
          isDeleting={bulkDeleteAdmins.isPending}
          itemName="admin"
        />
      )}

      <AdminFormModal
        key={editingAdmin?.id || "create"}
        open={formOpen}
        title={editingAdmin ? "Edit Admin" : "Add Admin"}
        initialValues={
          editingAdmin
            ? {
                name: editingAdmin.name,
                email: editingAdmin.email,
                password: "",
                role: editingAdmin.role,
                isActive: editingAdmin.isActive,
              }
            : emptyAdmin
        }
        isEditing={Boolean(editingAdmin)}
        onClose={closeForm}
        onSubmit={handleSubmit}
        isSubmitting={createAdmin.isPending || updateAdmin.isPending}
        errorMessage={formError}
      />

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
        title="Delete admin?"
        description={`This will permanently remove ${deleteTarget?.name || "this admin"}.`}
        confirmLabel="Delete"
        variant="destructive"
        errorMessage={deleteError}
        isSubmitting={deleteAdmin.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
