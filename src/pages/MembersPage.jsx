import { useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Plus, Trash2, Upload, Loader2, X } from "lucide-react";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { DataTable } from "@/components/DataTable";
import { Loader } from "@/components/Loader";
import { PageHeader } from "@/components/PageHeader";
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
import { useMemberMutations, useMembers, useAllMembers } from "@/hooks/useMembers";
import { formatGenerationLabel, useGenerations } from "@/hooks/useGenerations";
import { uploadService } from "@/services/upload.service";
import { getPhotoUrl } from "@/utils/photoUrl";
import { SearchInput } from "@/components/SearchInput";
import { MemberRelationSelect } from "@/components/MemberRelationSelect";
import { SearchSelect } from "@/components/SearchSelect";
import { memberFormSchema } from "@/types/schemas";

const emptyMember = {
  name: "",
  birthYear: new Date().getFullYear(),
  deathYear: "",
  title: "",
  bio: "",
  photo: "",
  generation: "",
  parentIds: [],
  spouseId: "",
  childrenIds: [],
  fatherName: "",
  address: "",
  mobile: "",
  email: "",
  information: "",
};

function toFormValues(member) {
  return {
    name: member.name || "",
    birthYear: member.birthYear || new Date().getFullYear(),
    deathYear: member.deathYear ?? "",
    title: member.title || "",
    bio: member.bio || "",
    photo: member.photo || "",
    generation: member.generation?.toString() || "",
    parentIds: member.parentIds || [],
    spouseId: member.spouseId || "",
    childrenIds: member.childrenIds || [],
    fatherName: member.fatherName || "",
    address: member.address || "",
    mobile: member.mobile || "",
    email: member.email || "",
    information: member.information || "",
  };
}

function toPayload(values) {
  return {
    name: values.name,
    birthYear: Number(values.birthYear),
    deathYear: values.deathYear ? Number(values.deathYear) : null,
    title: values.title,
    bio: values.bio,
    photo: values.photo,
    generation: Number(values.generation),
    parentIds: values.parentIds,
    spouseId: values.spouseId || null,
    childrenIds: values.childrenIds,
    fatherName: values.fatherName,
    address: values.address,
    mobile: values.mobile,
    email: values.email,
    information: values.information,
  };
}

function MemberFormModal({
  open,
  title,
  initialValues,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
  allMembers = [],
  generations = [],
  currentMemberId,
}) {
  const [values, setValues] = useState(initialValues);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!open) {
    return null;
  }

  const handleChange = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setUploadingPhoto(true);

    try {
      const response = await uploadService.uploadMemberPhoto(file);
      setValues((current) => ({ ...current, photo: response.data.photo }));
    } catch (error) {
      setUploadError(error.message || "Failed to upload photo.");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    const payload = toPayload(values);
    const validation = memberFormSchema.safeParse(payload);

    if (!validation.success) {
      setValidationError(validation.error.errors[0]?.message || "Please check the form fields.");
      return;
    }

    await onSubmit(validation.data);
  };

  const photoPreview = getPhotoUrl(values.photo);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden">
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
          <CardContent className="grid gap-4 sm:grid-cols-2 overflow-y-auto py-4">
            {(errorMessage || validationError) && (
              <div className="sm:col-span-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage || validationError}
              </div>
            )}

            <div className="sm:col-span-2 flex flex-col items-center gap-3 rounded-md border border-dashed border-input bg-muted/20 p-5">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Member preview"
                    className="h-28 w-28 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/40">
                    <Upload className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto || isSubmitting}
              />

              <Button
                type="button"
                variant="default"
                size="sm"
                disabled={uploadingPhoto || isSubmitting}
                onClick={() => document.getElementById("photo-upload")?.click()}
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Add Photo
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                JPEG, PNG, WEBP, or GIF — max 5MB
              </p>

              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" value={values.name} onChange={handleChange("name")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input id="title" value={values.title} onChange={handleChange("title")} required />
            </div>

            <div className="space-y-2">
              {generations.length > 0 ? (
                <SearchSelect
                  id="generation"
                  label="Generation"
                  value={values.generation}
                  onChange={(val) =>
                    setValues((current) => ({ ...current, generation: val }))
                  }
                  options={generations.map((g) => ({
                    label: formatGenerationLabel(g),
                    value: String(g.number),
                  }))}
                  required
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No generations defined yet. Add generations first under the Generations tab.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthYear">Birth Year <span className="text-destructive">*</span></Label>
              <Input id="birthYear" type="number" value={values.birthYear} onChange={handleChange("birthYear")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deathYear">Death Year</Label>
              <Input id="deathYear" type="number" value={values.deathYear} onChange={handleChange("deathYear")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={values.email} onChange={handleChange("email")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile <span className="text-destructive">*</span></Label>
              <Input id="mobile" value={values.mobile} onChange={handleChange("mobile")} required />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="fatherName">Father Name</Label>
              <Input id="fatherName" value={values.fatherName} onChange={handleChange("fatherName")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
              <Input id="address" value={values.address} onChange={handleChange("address")} required />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <MemberRelationSelect
                label="Parents"
                placeholder="Select parent(s)..."
                members={allMembers}
                value={values.parentIds}
                onChange={(parentIds) =>
                  setValues((current) => ({ ...current, parentIds }))
                }
                multiple
                excludeId={currentMemberId}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <MemberRelationSelect
                label="Spouse"
                placeholder="Select spouse..."
                members={allMembers}
                value={values.spouseId}
                onChange={(spouseId) =>
                  setValues((current) => ({ ...current, spouseId }))
                }
                excludeId={currentMemberId}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <MemberRelationSelect
                label="Children"
                placeholder="Select child(ren)..."
                members={allMembers}
                value={values.childrenIds}
                onChange={(childrenIds) =>
                  setValues((current) => ({ ...current, childrenIds }))
                }
                multiple
                excludeId={currentMemberId}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio <span className="text-destructive">*</span></Label>
              <textarea
                id="bio"
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={values.bio}
                onChange={handleChange("bio")}
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="information">Additional Information</Label>
              <textarea
                id="information"
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={values.information}
                onChange={handleChange("information")}
              />
            </div>
          </CardContent>
          <CardFooter className="flex shrink-0 justify-end gap-2 border-t p-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || generations.length === 0}>
              {isSubmitting ? "Saving..." : "Save Member"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>,
    document.body
  );
}

export function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: members = [], isLoading, isError, isFetching } = useMembers(searchQuery);
  const { data: generations = [] } = useGenerations();
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [bulkDeleteError, setBulkDeleteError] = useState("");
  const [formError, setFormError] = useState("");
  const { data: allMembers = [] } = useAllMembers({ enabled: formOpen });
  const { createMember, updateMember, deleteMember, bulkDeleteMembers } = useMemberMutations();

  const handleBulkDelete = async (selectedIds, clearSelection) => {
    setBulkDeleteError("");
    try {
      await bulkDeleteMembers.mutateAsync(selectedIds);
      clearSelection();
    } catch (error) {
      setBulkDeleteError(error.message || "Failed to delete selected members.");
    }
  };

  const openCreate = () => {
    setEditingMember(null);
    setFormError("");
    setFormOpen(true);
  };

  const getGenerationLabel = (generationNumber) => {
    const generation = generations.find((item) => item.number === generationNumber);
    return generation
      ? formatGenerationLabel(generation)
      : `Generation ${generationNumber}`;
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingMember(null);
    setFormError("");
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingMember) {
        await updateMember.mutateAsync({ id: editingMember.id, payload });
      } else {
        await createMember.mutateAsync(payload);
      }
      closeForm();
    } catch (error) {
      setFormError(error.message || "Failed to save member.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleteError("");

    try {
      await deleteMember.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(error.message || "Failed to delete member.");
    }
  };

  const columns = [
    { key: "name", header: "Name" },
    { key: "title", header: "Title" },
    {
      key: "generation",
      header: "Generation",
      render: (row) => getGenerationLabel(row.generation),
    },
    { key: "email", header: "Email" },
    {
      key: "actions",
      header: "Actions",
      className: "w-32",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit member">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(row)}
            aria-label="Delete member"
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
        title="Family Members"
        description="Create, update, and manage family member records."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        }
      />

      {bulkDeleteError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {bulkDeleteError}
        </div>
      )}

      <SearchInput
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by First Name or Father's Name"
        className="max-w-md"
      />

      {isLoading ? (
        <Loader label="Loading members..." />
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load members. Please ensure you are logged in and the backend is running.
        </div>
      ) : isFetching && searchQuery.trim() ? (
        <Loader label="Searching members..." />
      ) : (
        <DataTable
          columns={columns}
          data={members}
          emptyTitle={
            searchQuery.trim()
              ? "No family members found."
              : "No members yet"
          }
          emptyDescription={
            searchQuery.trim()
              ? "Try a different first name or father's name."
              : "Add your first family member to get started."
          }
          onDeleteSelected={handleBulkDelete}
          isDeleting={bulkDeleteMembers.isPending}
          itemName="member"
        />
      )}

      <MemberFormModal
        key={editingMember?.id || "create"}
        open={formOpen}
        title={editingMember ? "Edit Member" : "Add Member"}
        initialValues={
          editingMember
            ? toFormValues(editingMember)
            : {
                ...emptyMember,
                generation: generations[0]?.number?.toString() || "",
              }
        }
        onClose={closeForm}
        onSubmit={handleSubmit}
        isSubmitting={createMember.isPending || updateMember.isPending}
        errorMessage={formError}
        allMembers={allMembers}
        generations={generations}
        currentMemberId={editingMember?.id}
      />

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError("");
          }
        }}
        title="Delete member?"
        description={`This will permanently remove ${deleteTarget?.name || "this member"}.`}
        confirmLabel="Delete"
        variant="destructive"
        errorMessage={deleteError}
        isSubmitting={deleteMember.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
