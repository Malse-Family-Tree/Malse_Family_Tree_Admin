import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div>
          <h1 className="text-3xl font-bold">Malse Family Tree</h1>
          <p className="mt-2 text-sidebar-foreground/70">Admin Panel</p>
        </div>
        <div className="space-y-4">
          <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-sidebar-foreground/80">
            Preserving our heritage, connecting generations.
          </blockquote>
          <p className="text-sm text-sidebar-foreground/60">
            Manage family members, administrators, and tree data from one
            central dashboard.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-background p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
