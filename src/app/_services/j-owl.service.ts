import { Injectable } from '@angular/core';

@Injectable()
export class JOwlService {

  constructor() { }

  loadOWLDocument() {
    const options = { locale: 'en' };
    jOWL.load('assets/foaf.rdf', function () {
      console.log("loaded");
    }, options);
  }

  getClasses() {
   new jOWL.SPARQL_DL("Class(?x)").execute({ onComplete :  function(results){
      const classes = results.jOWLArray("?x");
      classes.items.forEach(element => {
        console.log(element);
      });
    }});
  }

  getPropertyValues() {
    new jOWL.SPARQL_DL("ObjectProperty(?x)").execute({ onComplete :  function(pValues){
      console.log(pValues);
      console.log(pValues.jOWLArray("?x"));
  }});
  }

}
