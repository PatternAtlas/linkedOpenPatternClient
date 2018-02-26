import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeComponent } from 'angular-tree-component';

@Component({
  selector: 'app-properties-overview',
  templateUrl: './properties-overview.component.html',
  styleUrls: ['./properties-overview.component.css']
})
export class PropertiesOverviewComponent implements OnInit {

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  nodes = [];
  selectedProperty;
  constructor() { }

  ngOnInit() {
    this.getProperties();
  }

  getProperties() {
    jOWL.load('assets/wine.rdf', () => {
      new jOWL.SPARQL_DL('ObjectProperty(?x)').execute({
        onComplete: (result) => {
          this.onObjectPropertiesLoaded(result.jOWLArray('?x').items);
        }
      });
      new jOWL.SPARQL_DL('DatatypeProperty(?x)').execute({
        onComplete: (result) => {
          this.onDataTypePropertiesLoaded(result.jOWLArray('?x').items);
        }
      });
    });
  }

  onObjectPropertiesLoaded(objectProperties) {
    const objectPropertiesTreeData = {
      id: 1,
      name: 'ObjectProperties',
      children: objectProperties
    };
    this.nodes.push(objectPropertiesTreeData);
    this.tree.treeModel.update();
  }

  onDataTypePropertiesLoaded(dataTypeProperties) {
    const objectPropertiesTreeData = {
      id: 2,
      name: 'DataTypeProperties',
      children: dataTypeProperties
    };
    this.nodes.push(objectPropertiesTreeData);
    this.tree.treeModel.update();
  }

  nodeClickEvent(node) {
    if (node.isLeaf) {
      this.selectedProperty = node.data;
      console.log(this.selectedProperty);
    }
  }

}
