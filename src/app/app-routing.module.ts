import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { RoutesComponent } from "./components/routes/routes.component";
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

//Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: "routes", component: RoutesComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "**", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
