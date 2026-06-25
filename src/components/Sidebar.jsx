import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  TreePine,
} from "lucide-react";

import { APP_NAME, ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Dashboard",
    to: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Family Members",
    to: ROUTES.MEMBERS,
    icon: Users,
  },
  {
    label: "Admins",
    to: ROUTES.ADMINS,
    icon: ShieldCheck,
  },
];

export function Sidebar({ className, onNavigate }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
    onNavigate?.();
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <TreePine className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{APP_NAME}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <Separator className="mb-4 bg-sidebar-border" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
