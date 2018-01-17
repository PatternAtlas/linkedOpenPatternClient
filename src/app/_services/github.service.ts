import {RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class GithubService {

  private auth =  { Authorization: 'Token '};
  constructor(private http: HttpClient) { }

  addPattern(patternName: string, content: string) {
    const body = {
      'message': `added ${patternName}`,
      'content': btoa(content)
    };
    return this.http.put(`https://api.github.com/repos/ckrieger/githubApiTests/contents/patterns/${patternName}.html`,
    body, {headers: this.auth });
  }

  getPattern() {
    return this.http.get('https://api.github.com/repos/ckrieger/githubApiTests/contents/patterns/pattern1.md');
  }

}

