import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeComponent, TreeNode } from 'angular-tree-component';
import { Router } from '@angular/router';
import { DataSharingService } from '../../_services/data-sharing.service';

@Component({
  selector: 'app-browser-classes-overview',
  templateUrl: './browser-classes-overview.component.html',
  styleUrls: ['./browser-classes-overview.component.css']
})
export class BrowserClassesOverviewComponent implements OnInit {

  isEditMode = '';
  nodes = [];
  selectedNode = {
    label: '',
    terms: '',
    objectProperties: [],
    dataTypeProperties: [],
    disjointWith: [],
    instances: []
  };

  instance = {
    label: '',
    objectProperties: [],
    dataTypeProperties: [],
  };
  options = {
    getChildren: (node: TreeNode) => {
      return this.getChildren(node.data);
    }
  };
  isCreateInstanceMode = false;

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor(private router: Router, private dataSharingService: DataSharingService) { }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    jOWL.load('assets/vocabulary/semantic-pattern.rdf', () => {
      new jOWL.SPARQL_DL('Class(?x)').execute({
        onComplete: (result) => {
          this.onJowlComplete(result);
        }
      });
    });
  }

  onJowlComplete(results) {
    const rootParents = new Set();
    const classesOfVocab = results.jOWLArray('?x').items;
    classesOfVocab.forEach(element => {
      const itemArray = element.hierarchy(true);
      itemArray.each((el) => {
        if (true) {
          rootParents.add(el);
        }
      });
    });
    this.addNodesToTreeView(rootParents);
  }

  addNodesToTreeView(nodes) {
    nodes.forEach(el => {
      this.nodes.push({
        id: this.nodes.length + 1,
        name: el.name,
        hasChildren: true,
        jowlNode: el
      });
    });
    this.tree.treeModel.update();
  }

  getChildren(parentNode) {
    const children = [];
    parentNode.jowlNode.invParents.items.forEach(child => {
      children.push({
        name: child.name,
        hasChildren: typeof (child.invParents) !== 'undefined',
        jowlNode: child
      });
    });
    return children;
  }


  nodeClickEvent(node) {
    this.selectedNode.label = node.label();
    this.selectedNode.terms = this.getTerms(node);
    this.selectedNode.disjointWith = this.getDisjointWith(node);
    this.getInstanceOfClass(node);
    this.getProperties(node);
  }

  getTerms(node) {
    let terms = '';
    node.terms().forEach(element => {
      terms += `${element[0]} `;
    });
    return terms;
  }

  getDisjointWith(item) {
    if (!(item.isClass)) { return; }
    return $.map(
      jOWL.Xpath('*', item.jnode)
        .filter(function () { return this.nodeName === 'owl:disjointWith'; }),
      function (n, i) {
        return { 'owl:disjointWith': jOWL($(n).RDF_Resource()) };
      });
  }

  getInstanceOfClass(owlClass) {
    new jOWL.SPARQL_DL(`DirectType(?i, ${owlClass.label()})`).execute({
      onComplete: (result) => {
        this.selectedNode.instances = result.jOWLArray('?i').items;
      }
    });
  }

  getProperties(owlClass) {
    const objectProperties = [];
    const dataTypeProperties = [];
    new jOWL.SPARQL_DL(`PropertyValue(${owlClass.URI}, ?p, ?t)`).execute({
      onComplete: (properties) => {
        properties.results.forEach(p => {
          if (p['?p'].type === 'owl:DatatypeProperty') {
            dataTypeProperties.push(p);
          } else {
            objectProperties.push(p);
          }
        });
      }
    });
    this.selectedNode.dataTypeProperties = dataTypeProperties;
    this.selectedNode.objectProperties = objectProperties;
  }

  onCreateInstance() {
    this.isCreateInstanceMode = true;
    this.preFillInstance();
  }

  preFillInstance () {
    this.instance.dataTypeProperties = [];
    this.instance.label = this.selectedNode.label;
    this.instance.objectProperties = this.selectedNode.objectProperties;
    this.selectedNode.dataTypeProperties.forEach(p => {
      p.content = `### ${p['?p'].name}`;
      this.instance.dataTypeProperties.push(p);
    });
    console.log(this.instance);
  }

  onSaveClick() {
    console.log(this.instance);
  }

}




