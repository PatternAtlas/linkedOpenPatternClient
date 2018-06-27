import {TreeModule} from 'angular-tree-component/dist/angular-tree-component';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SparqlService } from './_services/sparql.service';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { AddPatternComponent } from './add-pattern/add-pattern.component';
import { GithubService } from './_services/github.service';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RdfGraphComponent } from './rdf-graph/rdf-graph.component';
import { SafeHtmlPipe } from './_pipes/safe-html.pipe';
import { RdfaService } from './_services/rdfa.service';
import { InstanceCreatorComponent } from './instance-creator/instance-creator.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddPropertyComponent } from './modal-add-property/modal-add-property.component';
import { JOwlService } from './_services/j-owl.service';
import { OntologyBrowserComponent } from './ontology-browser/ontology-browser.component';
import { PropertiesOverviewComponent } from './ontology-browser/properties-overview/properties-overview.component';

import { BrowserClassesOverviewComponent } from './ontology-browser/browser-classes-overview/browser-classes-overview.component';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import { MarkdownModule } from 'angular2-markdown';
import { LoginComponent } from './login/login.component';
import { UserService } from './_services/user.service';
import { AuthGuardService } from './_guards/auth-guard.service';
import { DataSharingService } from './_services/data-sharing.service';
import { ModalAddRelationshipComponent } from './modal-add-relationship/modal-add-relationship.component';
import { IriprettifierPipe } from './_pipes/iriprettifier.pipe';
import { PatternBrowserComponent } from './pattern-browser/pattern-browser.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    AddPatternComponent,
    RdfGraphComponent,
    SafeHtmlPipe,
    InstanceCreatorComponent,
    ModalAddPropertyComponent,
    OntologyBrowserComponent,
    PropertiesOverviewComponent,
    PatternBrowserComponent,
    BrowserClassesOverviewComponent,
    LoginComponent,
    ModalAddRelationshipComponent,
    IriprettifierPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TreeModule,
    SimplemdeModule.forRoot({
      provide: SIMPLEMDE_CONFIG,
      // config options 1
      useValue: {}
    }),
    MarkdownModule.forRoot(),
    ToastModule.forRoot(),
    NgbModule.forRoot()
  ],
  providers: [SparqlService, GithubService, RdfaService, JOwlService, UserService, AuthGuardService, DataSharingService],
  entryComponents: [
    ModalAddPropertyComponent,
    ModalAddRelationshipComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
