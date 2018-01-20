import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {SparqlService} from './_services/sparql.service';
import {FormsModule} from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AppRoutingModule} from './app-routing.module';
import { AddPatternComponent } from './add-pattern/add-pattern.component';
import { GithubService } from './_services/github.service';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RdfGraphComponent } from './rdf-graph/rdf-graph.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    AddPatternComponent,
    RdfGraphComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ToastModule.forRoot()
  ],
  providers: [SparqlService, GithubService],
  bootstrap: [AppComponent]
})
export class AppModule { }
