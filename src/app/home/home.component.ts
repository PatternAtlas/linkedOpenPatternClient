import { Component, OnInit, ViewChild } from '@angular/core';
import { SparqlService } from '../_services/sparql.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GithubService } from '../_services/github.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  queryResult;
  query = 'SELECT *' +
    'WHERE {' +
    'SERVICE <https://patternpedia.github.io/linkedOpenPatternClient/assets/individuals/public-cloud.rdf> {' +
    '?s ?p ?o  }' +
    '}';

  constructor(private sparqlService: SparqlService) { }


  ngOnInit() {
    
  }

  sendQuery() {
    this.sparqlService.sendQuery(this.query).subscribe(succ => this.queryResult = succ, err => console.log(err));
  }

 

}
