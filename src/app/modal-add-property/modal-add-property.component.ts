import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-add-property',
  templateUrl: './modal-add-property.component.html',
  styleUrls: ['./modal-add-property.component.css']
})
export class ModalAddPropertyComponent {

  @Input() properties;
  selectedProperty;
  value;

  constructor(public activeModal: NgbActiveModal) { 
    this.loadIndividuals();
  }

  loadIndividuals() {
    const options = { locale: 'en' };
    jOWL.load('assets/individuals.owl', () => {
      new jOWL.SPARQL_DL('Thing(?i)').execute({
        onComplete: results => {
          console.log(results.jOWLArray('?i'));
        }
      });
    }, options);
  }

  close() {
    const result = {
      property: this.selectedProperty,
      value: this.value
    };
    this.activeModal.close(result);
  }

}
