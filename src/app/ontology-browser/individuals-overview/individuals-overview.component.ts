import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../_services/github.service';
import { SparqlService } from '../../_services/sparql.service';

declare var SimpleMDE: any;

@Component({
  selector: 'app-individuals-overview',
  templateUrl: './individuals-overview.component.html',
  styleUrls: ['./individuals-overview.component.css']
})
export class IndividualsOverviewComponent implements OnInit {

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

  patternIndividuals = [];
  selectedIndividual;
  isEditMode = '';
  constructor(private ghService: GithubService, private sparqlService: SparqlService) { }

  ngOnInit() {
    this.ghService.getFilesOfADirectory('assets/individuals')
    .subscribe(fileInfos => {
      this.sparqlService.crawlPattern(fileInfos)
        .subscribe((succ: any) => {
          rdfstore.create((err, store) => {
            store.load('text/turtle', succ.graphAsTurtleString, (err, results) => {
              store.execute('SELECT * { ?s ?p ?o }', (err, results) => {
                if (!err) {
                  this.patternIndividuals = this.getPatternIndividuals(results);
                  console.log(this.patternIndividuals);
                }
              });
            });
          });
        }, err => console.log(err));
    });
  }

  getPatternIndividuals(RDFtriples) {
    const predicate = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
    const patternIndividuals = [];
    RDFtriples.forEach(result => {
      if (result.p.value === predicate && this.patternTypes.includes(result.o.value)) {
        patternIndividuals.push(result.s);
      }
    });
    return patternIndividuals;
  }

  getRelationshipsOfPattern() {

  }

}
