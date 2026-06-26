import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SearchSelect({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
}) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ),
    [options, searchQuery]
  );

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

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setSearchQuery("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
      )}

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id={id}
            type="text"
            value={open ? searchQuery : (selectedOption ? selectedOption.label : "")}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!open) setOpen(true);
            }}
            onClick={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            required={required && !value}
            className="w-full pl-9 pr-10"
            autoComplete="off"
          />
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
        </div>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg">
            <ul className="max-h-48 overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <li className="px-3 py-2 text-sm text-muted-foreground">
                  No options found.
                </li>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;

                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted",
                          isSelected && "bg-primary/5"
                        )}
                        onClick={() => handleSelect(opt.value)}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="font-medium">{opt.label}</span>
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
            
            {value && !required && (
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleClear}
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
