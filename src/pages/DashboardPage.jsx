import {
  Users,
  ShieldCheck,
  GitBranch,
  Activity,
  UserPlus,
  FileEdit,
  Server,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { Loader } from "@/components/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLACEHOLDER_USER } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useBackendHealth } from "@/hooks/useHealth";
import { formatDate } from "@/utils";
import { cn } from "@/lib/utils";

function BackendStatusCard() {
  const { isLoading, isSuccess, data } = useBackendHealth();

  const isConnected = isSuccess && data?.success;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base">Backend Status</CardTitle>
          <CardDescription>
            Real-time connection to the Malse Family Tree API
          </CardDescription>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isLoading && "bg-muted",
            isConnected && "bg-emerald-50",
            !isLoading && !isConnected && "bg-red-50"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Server
              className={cn(
                "h-5 w-5",
                isConnected ? "text-emerald-600" : "text-red-600"
              )}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Checking backend connection...
            </p>
          ) : isConnected ? (
            <>
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-700">Backend Connected</p>
                <p className="text-sm text-muted-foreground">
                  {data?.message || "API is responding normally"}
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-medium text-red-700">Backend Offline</p>
                <p className="text-sm text-muted-foreground">
                  Unable to reach the server. Ensure the backend is running on
                  port 5000.
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, value, description, icon: Icon, color, bg, isLoading }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {isLoading ? (
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          ) : (
            value
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading, isError } = useDashboardStats();
  const displayName = user?.name || PLACEHOLDER_USER.name;

  const statCards = [
    {
      title: "Total Members",
      value: stats?.totalMembers ?? 0,
      description: "Registered family members",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Admins",
      value: stats?.activeAdmins ?? 0,
      description: "Administrator accounts",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Tree Branches",
      value: stats?.treeBranches ?? 0,
      description: "Family generations in the tree",
      icon: GitBranch,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Recent Updates",
      value: stats?.recentUpdates ?? 0,
      description: "Changes this month",
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${displayName.split(" ")[0]}`}
        description="Overview of your family tree administration dashboard."
      />

      <BackendStatusCard />

      {isError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Failed to load dashboard stats. Please ensure you are logged in and the backend is running.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} isLoading={isLoading} />
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest member updates across the family tree.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader label="Loading recent activity..." />
          ) : stats?.recentActivity?.length ? (
            <div className="space-y-4">
              {stats.recentActivity.map((item) => {
                const isCreated = item.type === "created";
                const Icon = isCreated ? UserPlus : FileEdit;

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-lg border bg-muted/30 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {isCreated ? "New member added" : "Profile updated"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.name}
                        {item.title ? ` — ${item.title}` : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No recent activity yet. Add or update a family member to see activity here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
