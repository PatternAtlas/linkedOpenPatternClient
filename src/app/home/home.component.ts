import { Component, OnInit } from '@angular/core';
import { SparqlService } from '../_services/sparql.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GithubService } from '../_services/github.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  query = 'SELECT *' +
    'WHERE {' +
    'SERVICE <https://patternpedia.github.io/linkedOpenPatternClient/assets/individuals/public-cloud.rdf> {' +
    '?s ?p ?o  }' +
    '}';

  constructor(private sparqlService: SparqlService, private http: HttpClient, private activatedRoute: ActivatedRoute,
    private _router: Router, private ghService: GithubService) { }

  ngOnInit() {
    this.checkForCallbackParams();
    this.ghService.getTurtle();
    const file = `
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix pattern: <http://purl.org/semantic-pattern#>.
    <#periodic-workload> a pattern:CloudComputingPattern;
        pattern:proplem "##Problem" ;
        pattern:context "##Context";
        pattern:solution "##Solution" .`;

    const fileTwo = `
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix pattern: <https://patternpedia.github.io/linkedOpenPatternClient/assets/vocabulary/semantic-pattern.rdf>.
    <#public-cloud>
        pattern:proplem "##Problem" ;
        pattern:context "##Context";
        pattern:solution "##Solution" .`;

    rdfstore.create(function (err, store) {
      store.load('remote', "http://localhost:8080/api/readFile"
      , function (err, results) {
        console.log(store);
       console.log(results);  
      });
    });
  }

  sendQuery() {
    this.sparqlService.sendQuery(this.query).subscribe(succ => console.log(succ), err => console.log(err));
  }

  login() {
    const redirect_uri = 'https://patternpedia.github.io/linkedOpenPatternClient/home';
    const state = '1234';
    const url = `https://github.com/login/oauth/authorize?client_id=004b2ee1deb1794c5e96&type=user_agent&redirect_uri=${redirect_uri}`;
    window.location.href = url;
  }

  checkForCallbackParams() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const code = params['code'];
        if (code) {
          this.onRedirectCallback(code);
        }
      });
  }

  onRedirectCallback(code) {
    const body = {
      client_id: '004b2ee1deb1794c5e96',
      client_secret: '159f3516cac71e14f2feedfd8434d4bc0c80692c',
      code: code
    };
    let headers = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };
    this.http.post(`https://github.com/login/oauth/access_token?
    client_id=${body.client_id}&
    client_secret=${body.client_secret}&
    code=${body.code}`, null, headers).subscribe(succ => console.log(succ));
  }

}