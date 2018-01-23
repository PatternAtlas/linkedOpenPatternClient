import {SparqlService} from '../_services/sparql.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classes-overview',
  templateUrl: './classes-overview.component.html',
  styleUrls: ['./classes-overview.component.css']
})
export class ClassesOverviewComponent implements OnInit {

  classesOfVocab;
  constructor(private sparqlService: SparqlService, private router: Router) { }

  ngOnInit() {
    this.sparqlService.getVocab('http://xmlns.com/foaf/0.1/')
      .subscribe(succ => this.classesOfVocab = succ, err => console.log(err));
  }

  goToInstanceCreator(label: string) {
    this.router.navigate(['/addInstance', label]);
  }
}
