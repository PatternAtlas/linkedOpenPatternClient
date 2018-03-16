import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SparqlService } from '../_services/sparql.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddPropertyComponent } from '../modal-add-property/modal-add-property.component';
import { JOwlService } from '../_services/j-owl.service';
import { DataSharingService } from '../_services/data-sharing.service';
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
    dataTypeProperties: []
  };
  constructor(private sparqlService: SparqlService, private route: ActivatedRoute, private modalService: NgbModal,
     private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(this.dataSharingService.selectedClass);
    });
  }

  openModal() {
    const modalRef = this.modalService.open(ModalAddPropertyComponent);
    modalRef.componentInstance.properties = this.selectedClass.objectProperties;
    modalRef.result.then(result => {
    });
  }

  private deleteProperty(property) {
    // this.instance.properties.splice(this.instance.properties.indexOf(property), 1);
  }

  saveInstance() {
    this.instanceAsRdfa = '';
    this.instanceAsRdfa += `<div vocab="${this.vocabUri}">\n`;
    this.instanceAsRdfa += `<div resource="${this.resourceUri}" typeof="${this.instance.label}">\n`;
    this.instance.dataTypeProperties.forEach(property => {
      if (property.value) {
        this.instanceAsRdfa += `${property.name}<span property="${property.name}">${property.value}</span>\n`;
      }
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
