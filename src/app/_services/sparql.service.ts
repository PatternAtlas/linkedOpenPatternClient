import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SparqlService {

  constructor(private http: HttpClient) { }

  sendQuery(query: String) {
    return this.http.post('http://localhost:8080/api/executeQuery', query);
  }

}
