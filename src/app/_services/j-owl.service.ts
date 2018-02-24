import { Injectable } from '@angular/core';

@Injectable()
export class JOwlService {
  classes = [];

  constructor() { }

  loadOWLDocument() {
    const options = { locale: 'en' };
    jOWL.load('assets/foaf.rdf', function () {
      console.log('loaded');
    }, options);
  }

  getClasses() {
    const options = { locale: 'en' };
    jOWL.load('assets/semantic-pattern.owl', () => {
      new jOWL.SPARQL_DL('Class(?x)').execute({
        onComplete: results => {
          this.classes = results.jOWLArray('?x').items;
          this.classes.forEach(el => {
            this.getObjectProperties(el);
            this.getDataTypeProperties(el);
          });
        }
      });
    }, options);
  }

  getObjectProperties(vocabClass) {
    vocabClass.objectProperties = [];
    new jOWL.SPARQL_DL('ObjectProperty(?x)').execute({
      onComplete: results => {
        results.jOWLArray('?x').items.forEach(objectProperty => {
          if (true) {
            vocabClass.objectProperties.push(objectProperty);
          }
        });
      }
    });
  }

  getDataTypeProperties(vocabClass) {
    vocabClass.dataTypeProperties = [];
    new jOWL.SPARQL_DL('DatatypeProperty(?x)').execute({
      onComplete: results => {
        results.jOWLArray('?x').items.forEach(dataTypeProperty => {
          if (dataTypeProperty.domain === vocabClass.URI) {
            vocabClass.dataTypeProperties.push(dataTypeProperty);
          }
        });
      }
    });
  }

  getClassByName(name) {
    return this.classes.find(el => {
     return el.name === name;
    });
  }

}
