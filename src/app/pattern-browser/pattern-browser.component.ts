import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ApplicationRef, AfterViewInit } from '@angular/core';
import { GithubService } from '../_services/github.service';
import { SparqlService } from '../_services/sparql.service';
import { ConcreteSolution } from '../_models/concrete-solution';
import { Relationship } from '../_models/relationship';
import { Pattern } from '../_models/pattern';

declare var SimpleMDE: any;

@Component({
  selector: 'app-pattern-browser',
  templateUrl: './pattern-browser.component.html',
  styleUrls: ['./pattern-browser.component.css'],
})
export class PatternBrowserComponent implements AfterViewInit {

  patternTypes = [
    'http://purl.org/semantic-pattern#CloudComputingFundamentalPattern',
    'http://purl.org/semantic-pattern#CloudComputingFundamental',
    'http://purl.org/semantic-pattern#CloudComputingPattern',
    'http://purl.org/semantic-pattern#CloudOfferingPattern',
    'http://purl.org/semantic-pattern#CompositeCloudApplicationPattern',
    'http://purl.org/semantic-pattern#CloudApplicationManagementPattern'
  ];

  prdTypes = [
    'http://purl.org/semantic-pattern#PRD',
    'http://purl.org/semantic-pattern#Alternative',
    'http://purl.org/semantic-pattern#KnownUse',
    'http://purl.org/semantic-pattern#ConsiderAfter',
    'http://purl.org/semantic-pattern#SeeAlso',
  ];

  patternIndividuals;
  selectedIndividual;
  isEditMode = '';
  isMouseOver = false;


  constructor(
    private ghService: GithubService,
    private sparqlService: SparqlService,
    private ref: ChangeDetectorRef,
    private appRev: ApplicationRef
  ) { }

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
        const patternIndividual = new Pattern(result.s.value);
        patternIndividual.dataTypeProperties = this.getDataTypeProperties(rdfTriples, patternIndividual.iri);
        patternIndividual.relationships = this.getRelationshipsOfPattern(rdfTriples, patternIndividual.iri);
        patternIndividual.concreteSolutions = this.getConcreteSolutionsOfPattern(rdfTriples, patternIndividual.iri);
        patternIndividuals.push(patternIndividual);
      }
    });
    return patternIndividuals;
  }

  getDataTypeProperties(rdfTriples, patternIRI) {
    const properties = [];
    rdfTriples.forEach(triple => {
      if (triple.s.value === patternIRI && triple.o.token === "literal") {
        properties.push(triple);
      }
    });
    return properties;
  }

  getRelationshipsOfPattern(rdfTriples, patternIRI) {
    const relationshipsOfPattern = [];
    const irisOfPRDs = this.getIRIsOFPRDs(rdfTriples, patternIRI);
    irisOfPRDs.forEach(iri => {
      const relationship = new Relationship(iri);
      rdfTriples.forEach(triple => {
        if (triple.s.value === iri && triple.p.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
          relationship.type = triple.o.value;
        } else if (triple.s.value === iri && triple.p.value === 'http://purl.org/semantic-pattern#additionalDescription') {
          relationship.additionalDescription = triple.o.value;
        } else if (triple.s.value === iri && triple.p.value === 'http://purl.org/semantic-pattern#hasTarget') {
          relationship.target = triple.o.value;
        }
      });
      relationshipsOfPattern.push(relationship);
    });
    return relationshipsOfPattern;
  }

  getConcreteSolutionsOfPattern(rdfTriples, patternIRI) {
    const concreteSolutionsOfPattern = [];
    const irisOfCSDs = this.getIRIsOfCSDs(rdfTriples, patternIRI);
    irisOfCSDs.forEach(iri => {
      const concreteSolution = new ConcreteSolution(iri);
      rdfTriples.forEach(triple => {
        if (triple.s.value === iri && triple.p.value === 'http://purl.org/semantic-pattern#hasCSArtifact') {
          concreteSolution.artifactIri = triple.o.value;
        } else if (triple.s.value === iri && triple.p.value === 'http://purl.org/dc/terms/description') {
          concreteSolution.description = triple.o.value;
        }
      });
      concreteSolutionsOfPattern.push(concreteSolution);
    });
    return concreteSolutionsOfPattern;
  }

  getIRIsOfCSDs(rdfTriples, patternIRI) {
    const irisOfCSDs = [];
    rdfTriples.forEach(triple => {
      if (triple.o.value === patternIRI && triple.p.value === 'http://purl.org/semantic-pattern#implementsPattern') {
        irisOfCSDs.push(triple.s.value);
      }
    });
    return irisOfCSDs;
  }

  getIRIsOFPRDs(rdfTriples, patternIRI) {
    const irisOfPRDs = [];
    rdfTriples.forEach(triple => {
      if (triple.o.value === patternIRI && triple.p.value === 'http://purl.org/semantic-pattern#hasSource') {
        irisOfPRDs.push(triple.s.value);
      }
    });
    return irisOfPRDs;
  }

  onPatternSelected(pattern) {
    this.selectedIndividual = pattern;
    this.appRev.tick();
  }

  onPatternLinkClicked(patternIRI) {
    this.selectedIndividual = this.patternIndividuals.find(function (el) {
      return el.IRI === patternIRI;
    });
    this.appRev.tick();
  }

  over(additionalDescription) {
    this.isMouseOver = true;
    this.appRev.tick();
  }

  leave() {
    console.log("leave");
    this.isMouseOver = false;
    this.appRev.tick();
  }
}
