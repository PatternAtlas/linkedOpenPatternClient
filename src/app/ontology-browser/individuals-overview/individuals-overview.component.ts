import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { GithubService } from '../../_services/github.service';
import { SparqlService } from '../../_services/sparql.service';

declare var SimpleMDE: any;

@Component({
  selector: 'app-individuals-overview',
  templateUrl: './individuals-overview.component.html',
  styleUrls: ['./individuals-overview.component.css'],
})
export class IndividualsOverviewComponent {

  patternTypes = [
    'http://purl.org/semantic-pattern#CloudComputingFundamentalPattern',
    'http://purl.org/semantic-pattern#CloudComputingFundamental',
    'http://purl.org/semantic-pattern#CloudComputingPattern',
    'http://purl.org/semantic-pattern#CloudOfferingPattern',
    'http://purl.org/semantic-pattern#CompositeCloudApplicationPattern'
  ];

  prdTypes =  [
    'http://purl.org/semantic-pattern#PRD',
    'http://purl.org/semantic-pattern#Alternative',
    'http://purl.org/semantic-pattern#KnownUse',
    'http://purl.org/semantic-pattern#ConsiderAfter',
    'http://purl.org/semantic-pattern#SeeAlso',
  ];

  patternIndividuals;
  selectedIndividual;
  isEditMode = '';

  
  constructor(private ghService: GithubService, private sparqlService: SparqlService, private ref: ChangeDetectorRef, private appRev: ApplicationRef) { }

  ngAfterViewInit() {
    this.ghService.getFilesOfADirectory('assets/individuals')
    .subscribe(fileInfos => {
      this.sparqlService.crawlPattern(fileInfos)
        .subscribe((succ: any) => {
          rdfstore.create((err, store) => {
            store.load('text/turtle', succ.graphAsTurtleString, (err, results) => {
              store.execute('SELECT * { ?s ?p ?o }', (err, results) => {
                if (!err) {
                  this.patternIndividuals = this.getPatternIndividuals(results);
                  this.appRev.tick();
                }
              });
            });
          });
        }, err => console.log(err));
    });
  }

  getPatternIndividuals(rdfTriples) {
    const predicate = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
    const patternIndividuals = [];
    rdfTriples.forEach(result => {
      if (result.p.value === predicate && this.patternTypes.includes(result.o.value)) {
        const patternIndividual = {
          IRI : result.s.value,
          dataTypeProperties : [],
          relationships: []
        }
        patternIndividual.dataTypeProperties = this.getDataTypeProperties(rdfTriples, patternIndividual.IRI);
        patternIndividual.relationships = this.getRelationshipsOfPattern(rdfTriples, patternIndividual.IRI);
        patternIndividuals.push(patternIndividual);
      }
    });
    return patternIndividuals;
  }

  getDataTypeProperties(rdfTriples, patternIRI) {
    const properties =[];
    rdfTriples.forEach(triple => {
      if(triple.s.value === patternIRI && triple.o.token === "literal") {
        properties.push(triple);
      }
    })
    return properties;
  }

  getRelationshipsOfPattern(rdfTriples, patternIRI) {
   const relationshipsOfPattern = [];
   const irisOfPRDs = this.getIRIsOFPRDs(rdfTriples, patternIRI);
   irisOfPRDs.forEach(iri => {
     let relationship = {
      IRI: iri, 
      type: '',
      additionalDescription: '',
      target: ''
     }
     rdfTriples.forEach(triple => {
       if(triple.s.value === iri && triple.p.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' ) {
         relationship.type = triple.o.value;
       } else if (triple.s.value === iri && triple.p.value === 'http://purl.org/semantic-pattern#additionalDescription'){
         relationship.additionalDescription = triple.o.value;
       } else if  (triple.s.value === iri && triple.p.value === 'http://purl.org/semantic-pattern#hasTarget') {
         relationship.target = triple.o.value;
       }
     })
     relationshipsOfPattern.push(relationship);
   })
   return relationshipsOfPattern;
  }

  getIRIsOFPRDs (rdfTriples, patternIRI) {
    const irisOfPRDs = [];
    rdfTriples.forEach(triple => {
      if(triple.o.value === patternIRI && triple.p.value === 'http://purl.org/semantic-pattern#hasSource') {
        irisOfPRDs.push(triple.s.value);
      }
    })
    return irisOfPRDs;
  }

  onPatternSelected(pattern) {
    this.selectedIndividual = pattern;
    this.appRev.tick();
  }

  onPatternLinkClicked(patternIRI){
    this.selectedIndividual = this.patternIndividuals.find(function(el) {
      return el.IRI === patternIRI;
    });
    this.appRev.tick();
  }

}
