import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-relationship',
  templateUrl: './modal-add-relationship.component.html',
  styleUrls: ['./modal-add-relationship.component.css']
})
export class ModalAddRelationshipComponent implements OnInit {

  typesOfPRDs = [];
  patterns = [];
  selectedPRD;
  selectedPattern;
  additionalDescription = '';
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.loadPRDs();
  }

  loadPRDs() {
    jOWL.load('assets/vocabulary/sePaSoReVocabulary.owl', () => {
      new jOWL.SPARQL_DL('Class(?x)').execute({
        onComplete: (result) => {
          this.onJowlComplete(result);
        }
      });
    });
  }

  onJowlComplete(results) {
    const rootParents = new Set();
    const classesOfVocab = results.jOWLArray('?x').items;
    classesOfVocab.forEach(element => {
      const itemArray = element.hierarchy(true);
      itemArray.each((el) => {
        if (el.name === 'PRD') {
          this.typesOfPRDs = this.getSubClasses(el);
        }
      });
    });
  }

  getSubClasses(parentNode) {
    const children = [];
    parentNode.invParents.items.forEach(child => {
      children.push({
        name: child.name,
        hasChildren: typeof (child.invParents) !== 'undefined',
        jowlNode: child,
        dataTypeProperties: this.getProperties(child)
      });
    });
    return children;
  }

  getProperties(owlClass) {
    const dataTypeProperties = [];
    new jOWL.SPARQL_DL(`PropertyValue(${owlClass.URI}, ?p, ?t)`).execute({
      onComplete: (properties) => {
        properties.results.forEach(p => {
          if (p['?p'].type === 'owl:DatatypeProperty') {
            p.content = `### ${p['?p'].name}`;
            dataTypeProperties.push(p);
          }
        });
      }
    });
    return dataTypeProperties;
  }

  close() {
    const result = '';
    this.activeModal.close(result);
  }

}
