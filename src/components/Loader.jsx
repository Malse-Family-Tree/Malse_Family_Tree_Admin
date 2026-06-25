import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Loader({ className, size = "default", label = "Loading..." }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      role="status"
      aria-label={label}
    >
      <Loader2
        className={cn("animate-spin text-primary", sizeClasses[size])}
      />
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
