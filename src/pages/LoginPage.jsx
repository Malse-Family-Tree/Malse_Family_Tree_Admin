import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TreePine } from "lucide-react";

import { loginSchema } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = () => {
    // UI only — authentication will be implemented later
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-2 text-center lg:hidden">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <TreePine className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to the Malse Family Tree admin panel
        </p>
      </div>

      <Card className="border-0 shadow-lg lg:border lg:shadow-sm">
        <CardHeader className="hidden lg:block">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                disabled
              >
                Forgot Password?
              </button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
