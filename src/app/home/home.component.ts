import { Component, OnInit } from '@angular/core';
import { SparqlService } from '../_services/sparql.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  query = 'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
    'SELECT ?name ?knows\n' +
    'WHERE {\n' +
    '  SERVICE <https://patternpedia.github.io/rdf-playground/rdfa.html> {\n' +
    '    ?s foaf:name ?name .' +
    '    ?s foaf:knows ?knows .  }\n' +
    '}';

  constructor(private sparqlService: SparqlService, private http: HttpClient, private activatedRoute: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this.checkForCallbackParams();
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
    let headers = {headers: new  HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'})};
    this.http.post(`https://github.com/login/oauth/access_token?
    client_id=${body.client_id}&
    client_secret=${body.client_secret}&
    code=${body.code}`, null, headers).subscribe(succ => console.log(succ));
  }

}
