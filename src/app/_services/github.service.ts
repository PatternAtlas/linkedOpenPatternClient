import {RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {PlatformLocation } from '@angular/common';

@Injectable()
export class GithubService {


  constructor(private http: HttpClient, private platformLocation: PlatformLocation) { }

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

  getBaseUrl() {
    let testUrl = 'https://ckrieger.github.io/pattern-solution-repository/';
    console.log(this.getUserName(testUrl));
    this.getRepository(testUrl);
    console.log((this.platformLocation as any).location.origin);
  }

  getUserName(url: string) {
    const userNameReg = /\https:\/\/+(.*)(?=.github.io)/g;
    const username = userNameReg.exec(url);
    return username[1];
  }

  getRepository(url: string) {
    const repoReg = /\github.io\/+(.*)(?=\/)/g;
    const repoName = repoReg.exec(url);
    console.log(repoName[1]);
  }

}

