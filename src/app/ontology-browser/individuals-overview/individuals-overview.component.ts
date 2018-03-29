import { Component, OnInit } from '@angular/core';

declare var SimpleMDE: any;

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
  
  onSaveClick() {
    this.isEditMode = '';
    console.log(this.selectedIndividual);
  }

  creatRdfFile() {
    const prefix = 'pattern';
    const prefixValue = 'https://patternpedia.github.io/linkedOpenPatternClient/assets/vocabulary/semantic-pattern.rdf';
    const header = `<rdf:RDF
    xmlns:${prefix} = "${prefixValue}"
    xmlns:rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#">`;
  }

}
