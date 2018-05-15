import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { GithubService } from '../_services/github.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { RdfaService } from '../_services/rdfa.service';
import { TreeComponent, TreeNode } from 'angular-tree-component';
import { NgbModal, NgbModalOptions, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddRelationshipComponent } from '../modal-add-relationship/modal-add-relationship.component';

@Component({
  selector: 'app-add-pattern',
  templateUrl: './add-pattern.component.html',
  styleUrls: ['./add-pattern.component.css']
})
export class AddPatternComponent implements OnInit {

  isEditMode = false;
  nodes = [];
  selectedNode = {
    label: '',
    terms: '',
    objectProperties: [],
    dataTypeProperties: [],
  };
  instance = {
    fileName: '',
    patternName: '',
    label: '',
    objectProperties: [],
    dataTypeProperties: [],
    relationships : []
  };

  @ViewChild(TreeComponent)
  private tree: TreeComponent;

  options = {
    getChildren: (node: TreeNode) => {
      return this.getChildren(node.data);
    }
  };

  constructor(
    private githubService: GithubService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef,
    private rdfaService: RdfaService,
    private modalService: NgbModal
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadClasses();
  }


  loadClasses() {
    jOWL.load('assets/vocabulary/sePaSoReVocabulary.owl', () => {
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
        if (el.name === 'Pattern') {
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

  nodeClickEvent(node) {
    this.selectedNode.label = node.label();
    this.getProperties(node);
    this.preFillInstance();
  }

  getProperties(owlClass) {
    const objectProperties = [];
    const dataTypeProperties = [];
    new jOWL.SPARQL_DL(`PropertyValue(${owlClass.URI}, ?p, ?t)`).execute({
      onComplete: (properties) => {
        properties.results.forEach(p => {
          if (p['?p'].type === 'owl:DatatypeProperty' && p['?p'].name !== 'patternName') {
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

  preFillInstance() {
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
    const content = this.createRdfFile();
    const authToken = localStorage.getItem('token');
    this.githubService.addPattern(this.instance.fileName, content, 'f93008e056ef246a31dd00819774ce71fdeaf117')
      .subscribe(succ => {
        this.toastr.success('Pattern saved!', 'Success!');

      }, err => this.toastr.error('Something went wrong!', 'Error!'));
  }

  createRdfFile() {
    const prefix = 'pattern';
    const prefixValue = 'https://patternpedia.github.io/linkedOpenPatternClient/assets/vocabulary/semantic-pattern.rdf';
    let header = `<rdf:RDF
    xmlns:${prefix} = "${prefixValue}"
    xmlns:rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"> \n`;
    header += this.createBody(prefix);
    header += '</rdf:RDF>';
    return header;
  }

  createBody(prefix) {
    const owlClass = this.instance.label.replace(/\s/g, '');
    let body = `<${prefix}:${owlClass} rdf:ID="PublicCloud"> \n`;
    this.instance.dataTypeProperties.forEach(p => {
      body += `    <${prefix}:${p['?p'].name}>${p.content}</${prefix}:${p['?p'].name}> \n`;
    });
    body += `</${prefix}:${owlClass}> \n`;
    return body;
  }

  openModalAddRelationship() {
    const modalRef = this.modalService.open(ModalAddRelationshipComponent);
    modalRef.result.then(result => {
      this.instance.relationships.push(result);
      console.log(result);
    });
  }


}
