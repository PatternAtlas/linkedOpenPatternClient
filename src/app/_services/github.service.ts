import {RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class GithubService {


  constructor(private http: HttpClient) { }

  addPattern(patternName: string, content: string, authToken: string) {
    const body = {
      'message': `added ${patternName}`,
      'content': btoa(content)
    };
    const auth =  { Authorization: `Token ${authToken}`};
    return this.http.put(`https://api.github.com/repos/ckrieger/githubApiTests/contents/patterns/${patternName}.html`,
    body, {headers: auth });
  }

  getPattern() {
    return this.http.get('https://api.github.com/repos/ckrieger/githubApiTests/contents/patterns/pattern1.md');
  }

}

