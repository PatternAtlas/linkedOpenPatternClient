import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddPatternComponent } from './add-pattern/add-pattern.component';
import { InstanceCreatorComponent } from './instance-creator/instance-creator.component';
import { ClassesOverviewComponent } from './classes-overview/classes-overview.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Home' }
  },
  {
    path: 'add',
    component: AddPatternComponent,
    data: { title: 'Add Pattern' }
  },
  {
    path: 'addInstance',
    component: ClassesOverviewComponent,
    data: { title: 'Add Foaf' }
  },
  {
    path: 'addInstance/:label',
    component: InstanceCreatorComponent
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
