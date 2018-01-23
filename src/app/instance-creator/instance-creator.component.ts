import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SparqlService } from '../_services/sparql.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddPropertyComponent } from '../modal-add-property/modal-add-property.component';
@Component({
  selector: 'app-instance-creator',
  templateUrl: './instance-creator.component.html',
  styleUrls: ['./instance-creator.component.css']
})
export class InstanceCreatorComponent implements OnInit {
  closeResult: string;
  selectedClass;
  instanceAsRdfa;
  resourceUri = 'someUri';
  vocabUri = 'http://xmlns.com/foaf/0.1/';
  instance = {
    label: '',
    uri: '',
    properties: []
  };
  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const label = params['label'];
      this.sparqlService.getVocab(this.vocabUri)
        .subscribe(succ => {
          const classesOfVocab: any = succ;
          this.selectedClass = this.getClass(classesOfVocab, label);
          this.instance.label = this.selectedClass.label;
          this.instance.uri = this.selectedClass.uri;
        }, err => console.log(err));
    });
  }

  openModal(properties) {
    const modalRef = this.modalService.open(ModalAddPropertyComponent);
    modalRef.componentInstance.properties = properties;
    modalRef.result.then(result => {
      this.instance.properties.push(result);
    });
  }

  private deleteProperty(property) {
    this.instance.properties.splice(this.instance.properties.indexOf(property), 1);
  }

  saveInstance() {
    this.instanceAsRdfa = '';
    this.instanceAsRdfa += `<div vocab="${this.vocabUri}">\n`;
    this.instanceAsRdfa += `<div resource="${this.resourceUri}" typeof="${this.instance.label}">\n`;
    this.instance.properties.forEach(property => {
      this.instanceAsRdfa += `${property.property.label}<span property="${property.property.label}">${property.value}</span>\n`;
    });
    this.instanceAsRdfa += '</div>';
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
