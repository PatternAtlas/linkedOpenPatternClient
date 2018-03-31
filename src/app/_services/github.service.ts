import { RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';

@Injectable()
export class GithubService {

  private ghBaseUrl = 'https://api.github.com';
  private repoName: string;
  private userName: string;

  constructor(private http: HttpClient, private platformLocation: PlatformLocation) {
    this.userName = this.getUserName();
    this.repoName = this.getRepoName();
  }

  addPattern(patternName: string, content: string, authToken: string) {
    const body = {
      'message': `added ${patternName}`,
      'content': btoa(content),
      'branch': 'gh-pages'
    };
    const auth = { Authorization: `Token ${authToken}` };
    return this.http.put(`${this.ghBaseUrl}/repos/${this.userName}/${this.repoName}/contents/assets/individuals/${patternName}.rdf`,
      body, { headers: auth });
  }

  getPattern(fileName: string) {
    return this.http.get(`${this.ghBaseUrl}/repos/${this.userName}/${this.repoName}/contents/patterns/${fileName}.html?ref=gh-pages`);
  }

  getTurtle() {
    const cType = { "Content-Type": `text/turtle`, "Accept" : `text/turtle` };
    this.http.get('http://localhost:8080/api/readFile', {headers: cType}).subscribe(succ => console.log(succ.json()));
  }

  private getUserName(): string {
    // const baseUrl =  (this.platformLocation as any).location.href;
    const locationHref = 'https://patternpedia.github.io/linkedOpenPatternClient/add';
    const userNameReg = /\https:\/\/+(.*)(?=.github.io)/g;
    const username = userNameReg.exec(locationHref);
    return username[1];
  }

  private getRepoName(): string {
    // const baseUrl =  (this.platformLocation as any).location.href;
    const locationHref = 'https://patternpedia.github.io/linkedOpenPatternClient/add';
    const repoReg = /\github.io\/+(.*)(?=\/)/g;
    const repoName = repoReg.exec(locationHref);
    return repoName[1];
  }

}

