import { useState } from "react";
import { Layers, Pencil, Plus, Trash2, X } from "lucide-react";

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
import {
  formatGenerationLabel,
  useGenerationMutations,
  useGenerations,
} from "@/hooks/useGenerations";

const emptyGeneration = {
  number: 1,
  name: "",
};

function GenerationFormModal({
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
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit({
      number: Number(values.number),
      name: values.name.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
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
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="number">Generation Number</Label>
              <Input
                id="number"
                type="number"
                min="1"
                value={values.number}
                onChange={handleChange("number")}
                required
                disabled={isEditing}
              />
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  Number cannot be changed while members are assigned to this generation.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Generation Name</Label>
              <Input
                id="name"
                value={values.name}
                onChange={handleChange("name")}
                placeholder="e.g. Grandparents"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Generation"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export function GenerationsPage() {
  const { data: generations = [], isLoading, isError } = useGenerations();
  const { createGeneration, updateGeneration, deleteGeneration } =
    useGenerationMutations();
  const [formOpen, setFormOpen] = useState(false);
  const [editingGeneration, setEditingGeneration] = useState(null);
  const [createDefaults, setCreateDefaults] = useState(emptyGeneration);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const openCreate = () => {
    const nextNumber =
      generations.length > 0
        ? Math.max(...generations.map((g) => g.number)) + 1
        : 1;

    setEditingGeneration(null);
    setFormError("");
    setCreateDefaults({ number: nextNumber, name: "" });
    setFormOpen(true);
  };

  const openEdit = (generation) => {
    setEditingGeneration(generation);
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingGeneration(null);
    setFormError("");
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingGeneration) {
        await updateGeneration.mutateAsync({
          id: editingGeneration.id,
          payload: { name: payload.name },
        });
      } else {
        await createGeneration.mutateAsync(payload);
      }
      closeForm();
    } catch (error) {
      setFormError(error.message || "Failed to save generation.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteError("");
      await deleteGeneration.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError(error.message || "Failed to delete generation.");
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: "number",
      header: "Number",
      render: (row) => row.number,
    },
    {
      key: "name",
      header: "Name",
      render: (row) => row.name,
    },
    {
      key: "label",
      header: "Member Form Label",
      render: (row) => formatGenerationLabel(row),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-32",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEdit(row)}
            aria-label="Edit generation"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(row)}
            aria-label="Delete generation"
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
        title="Generations"
        description="Define generation numbers and names used when adding family members."
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Generation
          </Button>
        }
      />

      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        <Layers className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          Each generation appears in the member form as{" "}
          <span className="font-medium text-foreground">2 - Grandparents</span>.
          Add generations before assigning members to them.
        </p>
      </div>

      {deleteError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {deleteError}
        </div>
      )}

      {isLoading ? (
        <Loader label="Loading generations..." />
      ) : isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load generations. Please ensure you are logged in and the backend is running.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={generations}
          emptyTitle="No generations yet"
          emptyDescription="Add your first generation to organize the family tree."
        />
      )}

      <GenerationFormModal
        key={editingGeneration?.id || `create-${createDefaults.number}`}
        open={formOpen}
        title={editingGeneration ? "Edit Generation" : "Add Generation"}
        initialValues={
          editingGeneration
            ? { number: editingGeneration.number, name: editingGeneration.name }
            : createDefaults
        }
        isEditing={Boolean(editingGeneration)}
        onClose={closeForm}
        onSubmit={handleSubmit}
        isSubmitting={
          createGeneration.isPending || updateGeneration.isPending
        }
        errorMessage={formError}
      />

      <ConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete generation?"
        description={`This will permanently remove "${deleteTarget ? formatGenerationLabel(deleteTarget) : "this generation"}". Generations with assigned members cannot be deleted.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
