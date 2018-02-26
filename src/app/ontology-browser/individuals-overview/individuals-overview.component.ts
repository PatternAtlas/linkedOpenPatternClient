import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-individuals-overview',
  templateUrl: './individuals-overview.component.html',
  styleUrls: ['./individuals-overview.component.css']
})
export class IndividualsOverviewComponent implements OnInit {

  individuals = [];
  selectedIndividual;
  constructor() { }

  ngOnInit() {
    this.getIndividuals();
  }

  getIndividuals() {
    jOWL.load('assets/wine.rdf', () => {
      const arr = new jOWL.Ontology.Array();
      // tslint:disable-next-line:forin
      for (const key in jOWL.index('Thing')) {
        this.individuals.push(jOWL.index('Thing')[key]);
        arr.concat(jOWL.index('Thing')[key], true);
      }
      this.individuals = arr.items;
    });
  }

  onIndividualSelected(individual) {
    new jOWL.SPARQL_DL(`PropertyValue(${individual.label()}, ?p, ?t)`).execute({
      onComplete: (result) => {
        this.selectedIndividual = individual;
        this.selectedIndividual.propertyValues = result.results;
      }
    });
  }

}
