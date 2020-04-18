import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";

//User Components
import { IndexUserComponent } from './components/users/index/index.component';
import { AddUserComponent } from './components/users/add/add.component';
import { ShowUserComponent } from './components/users/show/show.component';
import { EditUserComponent } from './components/users/edit/edit.component';

//Route Components
import { IndexRouteComponent } from './components/routes/index/index.component';
import { AddRouteComponent } from './components/routes/add/add.component';
import { ShowRouteComponent } from './components/routes/show/show.component';
import { EditRouteComponent } from './components/routes/edit/edit.component';

//Localization Components
import { IndexLocalizationComponent } from './components/localizations/index/index.component';
import { AddLocalizationComponent } from './components/localizations/add/add.component';
import { ShowLocalizationComponent } from './components/localizations/show/show.component';
import { EditLocalizationComponent } from './components/localizations/edit/edit.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

//Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  {
    path: "users",
    children: [
      {
        path: '',
        component: IndexUserComponent,
      },
      {
        path: 'add',
        component: AddUserComponent,
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: ShowUserComponent,
          },
          {
            path: 'edit',
            component: EditUserComponent
          }
        ]
      }
    ]
  },
  {
    path: "routes",
    children: [
      {
        path: '',
        component: IndexRouteComponent,
      },
      {
        path: 'add',
        component: AddRouteComponent,
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: ShowRouteComponent,
          },
          {
            path: 'edit',
            component: EditRouteComponent
          }
        ]
      }
    ]
  },
  {
    path: "localizations",
    children: [
      {
        path: '',
        component: IndexLocalizationComponent,
      },
      {
        path: 'add',
        component: AddLocalizationComponent,
      },
      {
        path: ':id',
        children: [
          {
            path: '',
            component: ShowLocalizationComponent,
          },
          {
            path: 'edit',
            component: EditLocalizationComponent
          }
        ]
      }
    ]
  },
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
