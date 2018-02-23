import { SparqlService } from '../_services/sparql.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JOwlService } from '../_services/j-owl.service';

@Component({
  selector: 'app-classes-overview',
  templateUrl: './classes-overview.component.html',
  styleUrls: ['./classes-overview.component.css']
})
export class ClassesOverviewComponent implements OnInit {

  classesOfVocab;
  constructor(private sparqlService: SparqlService, private router: Router, private jOWLService: JOwlService) { }

  ngOnInit() {
    this.jOWL();
    this.sparqlService.getVocab('https://ckrieger.github.io/linkedOpenPatternClient/foaf.rdf')
      .subscribe(succ => this.classesOfVocab = succ, err => console.log(err));
  }

  goToInstanceCreator(label: string) {
    this.router.navigate(['/addInstance', label]);
  }

  jOWL() {
    const options = { locale: 'en' };
    jOWL.load('assets/cloud-computing-patterns.owl', () => {
      console.log(this.jOWLService.getClasses());
      this.jOWLService.getPropertyValues();
    }, options);
  }

}
