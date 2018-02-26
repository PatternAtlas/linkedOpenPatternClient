import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-properties-overview',
  templateUrl: './properties-overview.component.html',
  styleUrls: ['./properties-overview.component.css']
})
export class PropertiesOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.getIndividuals();
  }

  getIndividuals() {
    jOWL.load('assets/wine.rdf', () => {
      const arr = new jOWL.Ontology.Array();
      // tslint:disable-next-line:forin
      for (const key in jOWL.index('Thing')) {
        arr.concat(jOWL.index('Thing')[key], true);
      }
      console.log(arr);
    });
  }

}
