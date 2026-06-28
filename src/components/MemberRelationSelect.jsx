import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { membersService } from "@/services/members.service";

function getMemberLabel(member) {
  if (!member) return "";
  if (member.fatherName) {
    return `${member.name} (Father: ${member.fatherName})`;
  }
  return member.name;
}

export function MemberRelationSelect({
  label,
  placeholder = "Search member...",
  value,
  onChange,
  multiple = false,
  excludeId,
  disabled = false,
}) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // We keep track of selected member objects so we can display their names
  const [selectedObjects, setSelectedObjects] = useState([]);

  const selectedIds = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

  // Fetch initial selected members if they exist and we don't have them in state
  useEffect(() => {
    const fetchInitial = async () => {
      const idsToFetch = selectedIds.filter(
        (id) => !selectedObjects.find((obj) => obj.id === id)
      );

      if (idsToFetch.length === 0) return;

      try {
        const fetched = await Promise.all(
          idsToFetch.map((id) => membersService.getById(id).then(res => res.data))
        );
        setSelectedObjects((prev) => [...prev, ...fetched]);
      } catch (error) {
        console.error("Failed to fetch initial members for select:", error);
      }
    };
    fetchInitial();
  }, [selectedIds, selectedObjects]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await membersService.search(searchQuery);
        // Exclude self if excludeId is provided
        const filtered = (response.data || []).filter(m => m.id !== excludeId);
        setSearchResults(filtered);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, excludeId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (member) => {
    if (multiple) {
      const nextValue = selectedIds.includes(member.id)
        ? selectedIds.filter((id) => id !== member.id)
        : [...selectedIds, member.id];
      
      if (!selectedIds.includes(member.id)) {
        setSelectedObjects(prev => [...prev, member]);
      }
      
      onChange(nextValue);
      return;
    }

    if (member.id === value) {
      onChange("");
    } else {
      setSelectedObjects([member]);
      onChange(member.id);
    }
    
    setOpen(false);
    setSearchQuery("");
  };

  const handleRemove = (memberId) => {
    if (multiple) {
      onChange(selectedIds.filter((id) => id !== memberId));
      setSelectedObjects(prev => prev.filter(m => m.id !== memberId));
      return;
    }
    onChange("");
    setSelectedObjects([]);
  };

  // Only consider currently valid selected objects
  const activeSelectedObjects = selectedObjects.filter(m => selectedIds.includes(m.id));

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label>{label}</Label>

      {multiple && activeSelectedObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeSelectedObjects.map((member) => (
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
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={open ? searchQuery : (!multiple && activeSelectedObjects.length > 0 ? getMemberLabel(activeSelectedObjects[0]) : "")}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onClick={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full pl-9 pr-10"
          />
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
            <ul className="max-h-48 overflow-y-auto py-1">
              {isSearching ? (
                <li className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
                </li>
              ) : searchResults.length === 0 && searchQuery.trim().length > 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  No members found.
                </li>
              ) : searchResults.length === 0 && searchQuery.trim().length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  Type to search members...
                </li>
              ) : (
                searchResults.map((member) => {
                  const isSelected = selectedIds.includes(member.id);

                  return (
                    <li key={member.id}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                          isSelected && "bg-primary/5"
                        )}
                        onClick={() => handleSelect(member)}
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
