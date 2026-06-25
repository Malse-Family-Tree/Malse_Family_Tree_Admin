import {
  Users,
  ShieldCheck,
  GitBranch,
  Activity,
  UserPlus,
  FileEdit,
} from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PLACEHOLDER_USER } from "@/constants";

const stats = [
  {
    title: "Total Members",
    value: "—",
    description: "Registered family members",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Active Admins",
    value: "—",
    description: "Administrator accounts",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Tree Branches",
    value: "—",
    description: "Family line connections",
    icon: GitBranch,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "Recent Updates",
    value: "—",
    description: "Changes this month",
    icon: Activity,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const recentActivity = [
  {
    icon: UserPlus,
    title: "New member added",
    description: "A family member profile was created",
    time: "Coming soon",
  },
  {
    icon: FileEdit,
    title: "Profile updated",
    description: "Member details were modified",
    time: "Coming soon",
  },
  {
    icon: ShieldCheck,
    title: "Admin activity",
    description: "Administrator logged in",
    time: "Coming soon",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${PLACEHOLDER_USER.name.split(" ")[0]}`}
        description="Overview of your family tree administration dashboard."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates across the family tree will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-lg border bg-muted/30 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
