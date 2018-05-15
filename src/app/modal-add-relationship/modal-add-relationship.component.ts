import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GithubService } from '../_services/github.service';
import { SparqlService } from '../_services/sparql.service';

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
  additionalInformation = '';
  constructor(public activeModal: NgbActiveModal,  private ghService: GithubService, private sparqlService: SparqlService) { }


  ngOnInit() {
    this.loadPRDs();
    this.getPatternIndividuals();
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

  getPatternIndividuals() {
    const patterns = [];
    this.ghService.getFilesOfADirectory('assets/individuals')
    .subscribe(fileInfos => {
      this.sparqlService.crawlPattern(fileInfos)
      .subscribe((succ) => {
        rdfstore.create(function (err, store) {
          store.load('text/turtle', succ.graphAsTurtleString, function (err, results) {
            const predicate = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
            const object = 'http://purl.org/semantic-pattern#CloudComputingFundamental';
            store.execute('SELECT * { ?s ?p ?o }', (err, results) => {
              if(!err) {
              results.forEach(result => {
                  if(result.p.value === predicate && result.o.value === object) {
                    patterns.push(result.s);
                    console.log(result)
                  }               
              });
              }
            });
          });
        });
        this.patterns = patterns;
      }, err => console.log(err));
    });
  }

  close() {
    const relationship = {
      linkedPattern : this.selectedPattern,
      prdType: this.selectedPRD,
      additionalInformation: this.additionalInformation
    };
    this.activeModal.close(relationship);
  }

}
