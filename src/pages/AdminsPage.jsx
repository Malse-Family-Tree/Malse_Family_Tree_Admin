import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ShieldCheck } from "lucide-react";

export function AdminsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admins"
        description="Admin management will be implemented."
      />
      <EmptyState
        icon={ShieldCheck}
        title="No admins configured"
        description="Administrator management features will be available in a future update."
      />
    </div>
  );
}
