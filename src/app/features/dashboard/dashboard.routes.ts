import { Routes } from "@angular/router";
import { AuthGuard } from "../../core/guards/auth.guard";
import { DashboardLayoutComponent } from "src/app/layouts/dashboard-layout/dashboard-layout.component";
import { OverviewComponent } from "./components/overview/overview.component";
import { UsersComponent } from "./components/users/users.component";

export const dashboardRoutes: Routes = [
  {
    path: "",
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "overview",
        component: OverviewComponent,
        data: { title: "Dashboard" },
      },
      {
        path: "",
        component: UsersComponent,
        data: { title: "User Management" },
      },
    ],
  },
];
