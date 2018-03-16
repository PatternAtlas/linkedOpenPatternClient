import { Injectable } from '@angular/core';

@Injectable()
export class DataSharingService {

  selectedClass = {
    label: '',
    terms: '',
    relations: [],
    disjointWith: [],
    instances: []
  };
  constructor() { }

}
