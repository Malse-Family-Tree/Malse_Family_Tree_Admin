import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function filterMembers(members, query, excludeId) {
  const normalizedQuery = query.trim().toLowerCase();

  return members.filter((member) => {
    if (excludeId && member.id === excludeId) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      member.name?.toLowerCase().includes(normalizedQuery) ||
      member.fatherName?.toLowerCase().includes(normalizedQuery)
    );
  });
}

function getMemberLabel(member) {
  if (member.fatherName) {
    return `${member.name} (Father: ${member.fatherName})`;
  }

  return member.name;
}

export function MemberRelationSelect({
  label,
  placeholder = "Select member...",
  members = [],
  value,
  onChange,
  multiple = false,
  excludeId,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedIds = multiple ? value : value ? [value] : [];

  const selectedMembers = useMemo(
    () => members.filter((member) => selectedIds.includes(member.id)),
    [members, selectedIds]
  );

  const filteredMembers = useMemo(
    () => filterMembers(members, searchQuery, excludeId),
    [members, searchQuery, excludeId]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (memberId) => {
    if (multiple) {
      const nextValue = selectedIds.includes(memberId)
        ? selectedIds.filter((id) => id !== memberId)
        : [...selectedIds, memberId];
      onChange(nextValue);
      return;
    }

    onChange(memberId === value ? "" : memberId);
    setOpen(false);
    setSearchQuery("");
  };

  const handleRemove = (memberId) => {
    if (multiple) {
      onChange(selectedIds.filter((id) => id !== memberId));
      return;
    }

    onChange("");
  };

  const displayText = multiple
    ? selectedMembers.length
      ? `${selectedMembers.length} selected`
      : placeholder
    : selectedMembers[0]
      ? getMemberLabel(selectedMembers[0])
      : placeholder;

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label>{label}</Label>

      {multiple && selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMembers.map((member) => (
            <span
              key={member.id}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {member.name}
              <button
                type="button"
                className="rounded-full hover:bg-primary/20"
                onClick={() => handleRemove(member.id)}
                aria-label={`Remove ${member.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "h-10 w-full justify-between font-normal",
            !selectedMembers.length && "text-muted-foreground"
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
            <div className="border-b p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name or father's name..."
                  className="pl-8"
                  autoFocus
                />
              </div>
            </div>

            <ul className="max-h-48 overflow-y-auto py-1">
              {filteredMembers.length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  No members found.
                </li>
              ) : (
                filteredMembers.map((member) => {
                  const isSelected = selectedIds.includes(member.id);

                  return (
                    <li key={member.id}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                          isSelected && "bg-primary/5"
                        )}
                        onClick={() => handleSelect(member.id)}
                      >
                        {multiple && (
                          <span
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded border",
                              isSelected && "border-primary bg-primary text-primary-foreground"
                            )}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="font-medium">{member.name}</span>
                          {member.fatherName && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              — Father: {member.fatherName}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {!multiple && value && (
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => handleRemove(value)}
                >
                  Clear selection
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
