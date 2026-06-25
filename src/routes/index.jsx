import { Navigate } from "react-router-dom";

import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  GuestRoute,
  ProtectedRoute,
  SuperAdminRoute,
} from "@/components/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MembersPage } from "@/pages/MembersPage";
import { GenerationsPage } from "@/pages/GenerationsPage";
import { AdminsPage } from "@/pages/AdminsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ROUTES } from "@/constants";

export const routes = [
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardPage />,
          },
          {
            path: ROUTES.MEMBERS,
            element: <MembersPage />,
          },
          {
            path: ROUTES.GENERATIONS,
            element: <GenerationsPage />,
          },
          {
            element: <SuperAdminRoute />,
            children: [
              {
                path: ROUTES.ADMINS,
                element: <AdminsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
