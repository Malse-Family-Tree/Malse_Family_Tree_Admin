import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Users } from "lucide-react";

export function MembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Family Members"
        description="Member management will be implemented."
      />
      <EmptyState
        icon={Users}
        title="No members yet"
        description="Family member management features will be available in a future update."
      />
    </div>
  );
}
