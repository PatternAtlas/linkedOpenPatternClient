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
    const userName = this.getUserName();
    const repoName = this.getRepoName();
    return this.http.put(`https://api.github.com/repos/${userName}/${repoName}/contents/patterns/${patternName}.html`,
    body, {headers: auth });
  }

  getPattern() {
    return this.http.get('https://api.github.com/repos/ckrieger/githubApiTests/contents/patterns/pattern1.md');
  }

  private getUserName() {
    console.log((this.platformLocation as any).location);
    console.log((this.platformLocation as any).location.href);
    const baseUrl = (this.platformLocation as any).location;
    console.log(baseUrl);
    const userNameReg = /\https:\/\/+(.*)(?=.github.io)/g;
    const username = userNameReg.exec(baseUrl);
    return username[1];
  }

  private getRepoName() {
    const baseUrl = (this.platformLocation as any).location;
    const repoReg = /\github.io\/+(.*)(?=\/)/g;
    const repoName = repoReg.exec(baseUrl);
    return repoName[1];
  }

}

