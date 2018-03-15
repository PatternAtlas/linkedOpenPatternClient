import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AddPatternComponent } from './add-pattern/add-pattern.component';
import { InstanceCreatorComponent } from './instance-creator/instance-creator.component';
import { ClassesOverviewComponent } from './classes-overview/classes-overview.component';
import { OntologyBrowserComponent } from './ontology-browser/ontology-browser.component';
import { PropertiesOverviewComponent } from './ontology-browser/properties-overview/properties-overview.component';
import { IndividualsOverviewComponent } from './ontology-browser/individuals-overview/individuals-overview.component';
import { BrowserClassesOverviewComponent } from './ontology-browser/browser-classes-overview/browser-classes-overview.component';
import { LoginComponent } from './login/login.component';

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
    path: 'browser',
    component: OntologyBrowserComponent,
    children: [
      { path: '', redirectTo: 'classes', pathMatch: 'full' },
      { path: 'classes', component: BrowserClassesOverviewComponent },
      { path: 'properties', component: PropertiesOverviewComponent },
      { path: 'individuals', component: IndividualsOverviewComponent }
    ]
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
