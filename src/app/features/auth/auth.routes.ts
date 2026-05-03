import { Routes } from "@angular/router";
import { NoAuthGuard } from "../../core/guards/no-auth.guard";
import { LoginPageComponent } from "./components/login-page/login-page.component";
import { RegisterPageComponent } from "./components/register-page/register-page.component";

export const authRoutes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginPageComponent,
    canActivate: [NoAuthGuard],
    data: { title: "Sign In" },
  },
  {
    path: "register",
    component: RegisterPageComponent,
    canActivate: [NoAuthGuard],
    data: { title: "Create Account" },
  },
];
