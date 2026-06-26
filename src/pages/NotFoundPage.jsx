import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button asChild>
        <Link to={ROUTES.DASHBOARD}>Go to Dashboard</Link>
      </Button>
    </div>
  );
}
