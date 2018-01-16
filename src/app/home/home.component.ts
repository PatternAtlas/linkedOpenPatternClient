import { Component, OnInit } from '@angular/core';
import {SparqlService} from '../_services/sparql.service';

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

  constructor(private sparqlService: SparqlService) {}

  ngOnInit() {
  }

  sendQuery() {
    this.sparqlService.sendQuery(this.query).subscribe(succ => console.log(succ), err => console.log(err));
  }

}
