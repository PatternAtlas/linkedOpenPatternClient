import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-individuals-overview',
  templateUrl: './individuals-overview.component.html',
  styleUrls: ['./individuals-overview.component.css']
})
export class IndividualsOverviewComponent implements OnInit {

  individuals = [];
  selectedIndividual;
  isEditMode = '';
  constructor() { }

  ngOnInit() {
    this.getIndividuals();
  }

  getIndividuals() {
    jOWL.load('assets/vocabulary/semantic-pattern.rdf', () => {
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
    new jOWL.SPARQL_DL(`PropertyValue(${individual.URI}, ?p, ?t)`).execute({
      onComplete: (result) => {
        const objectProperties = [];
        const dataTypeProperties = [];
        this.selectedIndividual = individual;
        result.results.forEach(p => {
          if (p['?p'].type === 'owl:DatatypeProperty') {
            dataTypeProperties.push(p);
          } else {
            objectProperties.push(p);
          }
        });
        this.selectedIndividual.objectProperties = objectProperties;
        this.selectedIndividual.dataTypeProperties = dataTypeProperties;
        console.log(this.selectedIndividual);
      }
    });
  }

  onEdit(property) {
    this.isEditMode = property['?p'].URI;
    console.log(this.isEditMode);
  }

}
