import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeComponent, TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-browser-classes-overview',
  templateUrl: './browser-classes-overview.component.html',
  styleUrls: ['./browser-classes-overview.component.css']
})
export class BrowserClassesOverviewComponent implements OnInit {

  nodes = [];
  selectedNode = {
    label: '',
    terms: '',
    relations: [],
    disjointWith: [],
    instances: []
  };
  options = {
    getChildren: (node: TreeNode) => {
      return this.getChildren(node.data);
    }
  };

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  constructor() { }

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    jOWL.load('assets/wine.rdf', () => {
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
        if (el.invParents) {
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
    new jOWL.SPARQL_DL(`PropertyValue(${node.label()}, ?p, ?t)`).execute({
      onComplete: (result) => {
        this.selectedNode.label = node.label();
        this.selectedNode.terms = this.getTerms(node);
        this.selectedNode.relations = result.jOWLArray('?p', '?t').items;
        this.selectedNode.disjointWith = this.getDisjointWith(node);
        this.getInstanceOfClass(node);
      }
    });
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

}




