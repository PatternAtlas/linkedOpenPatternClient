import { Component, OnInit } from '@angular/core';
import { GithubService } from '../_services/github.service';
import { error } from 'util';

@Component({
  selector: 'app-add-pattern',
  templateUrl: './add-pattern.component.html',
  styleUrls: ['./add-pattern.component.css']
})
export class AddPatternComponent implements OnInit {

  patternContent = '';
  patternName = '';
  token = '';
  constructor(private githubService: GithubService) { }

  ngOnInit() {
  }

  savePattern() {
    this.githubService.addPattern(this.patternName, this.patternContent, this.token).subscribe(succ => console.log(succ), err => console.log(err));
  }

}
