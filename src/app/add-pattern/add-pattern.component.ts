import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { GithubService } from '../_services/github.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { RdfaService } from '../_services/rdfa.service';

@Component({
  selector: 'app-add-pattern',
  templateUrl: './add-pattern.component.html',
  styleUrls: ['./add-pattern.component.css']
})
export class AddPatternComponent implements OnInit {

  patternContent = '---\n layout: default\n---';
  patternName = '';
  token = '';
  graphData;
  graphTimeout;
  constructor(private githubService: GithubService, public toastr: ToastsManager, vcr: ViewContainerRef, private rdfaService: RdfaService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  savePattern() {
    this.githubService.addPattern(this.patternName, this.patternContent, this.token)
      .subscribe(succ => {
        this.toastr.success('Pattern saved!', 'Success!');
        this.patternName = '';
        this.patternContent = '';
      }, err => this.toastr.error('Something went wrong!', 'Error!'));
  }

  getGraphData() {
    clearTimeout(this.graphTimeout);
    this.graphTimeout = setTimeout(() => {
      const preview: any = document.getElementById('preview').ownerDocument;
      GreenTurtle.attach(preview);
      this.graphData = this.rdfaService.toD3TreeGraph(preview.data);
    }, 1000);
  }



}
