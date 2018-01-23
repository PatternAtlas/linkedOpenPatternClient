import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SparqlService } from '../_services/sparql.service';

@Component({
  selector: 'app-instance-creator',
  templateUrl: './instance-creator.component.html',
  styleUrls: ['./instance-creator.component.css']
})
export class InstanceCreatorComponent implements OnInit {

  selectedClass;
  constructor(private sparqlService: SparqlService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const label = params['label'];
      this.sparqlService.getVocab('http://xmlns.com/foaf/0.1/')
        .subscribe(succ => {
          const classesOfVocab: any = succ;
          this.selectedClass = this.getClass(classesOfVocab, label);
        }, err => console.log(err));
    });
  }

  private getClass(classesOfVocab, label) {
    let selectedClass;
    classesOfVocab.forEach(element => {
      if (element.label === label) {
        selectedClass = element;
      }
    });
    return selectedClass;
  }
}
