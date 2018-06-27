import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddPatternComponent } from './add-pattern/add-pattern.component';
import { InstanceCreatorComponent } from './instance-creator/instance-creator.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard } from './_guards/auth-guard.service';
import { PatternBrowserComponent } from './pattern-browser/pattern-browser.component';


const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  {
    path: 'add',
    component: AddPatternComponent,
    canActivate: [AuthGuard],
    data: { title: 'Add Pattern' }
  },
  {
    path: 'addInstance/:label',
    component: InstanceCreatorComponent
  },
  {
    path: 'browser',
    component: PatternBrowserComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
