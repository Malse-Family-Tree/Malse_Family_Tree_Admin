import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";

export function DataTable({
  columns,
  data = [],
  emptyTitle = "No data found",
  emptyDescription,
  className,
  onDeleteSelected,
  isDeleting = false,
  itemName = "item",
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  
  // If onDeleteSelected is provided, the table is selectable
  const selectable = Boolean(onDeleteSelected);

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(data.map((row) => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDelete = () => {
    if (onDeleteSelected) {
      onDeleteSelected(selectedIds, () => setSelectedIds([]));
    }
  };
  if (!data.length) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="space-y-4">
      {selectable && selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-md bg-muted/50 p-2 px-4 border border-border/50">
          <span className="text-sm font-medium">
            {selectedIds.length} {selectedIds.length === 1 ? itemName : `${itemName}s`} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Selected
          </Button>
        </div>
      )}
      <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={allSelected}
                  ref={(ref) => {
                    if (ref) {
                      ref.indeterminate = someSelected;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
            )}
            <TableHead className="w-[100px] text-center">Sr. No.</TableHead>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id ?? rowIndex}>
              {selectable && (
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                    aria-label={`Select row`}
                  />
                </TableCell>
              )}
              <TableCell className="text-center">{rowIndex + 1}</TableCell>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(row, rowIndex)
                    : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
