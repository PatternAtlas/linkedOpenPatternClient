import { Injectable } from '@angular/core';

@Injectable()
export class RdfaService {

  bnodeNames = {};
  bnodeCount;
  embedded = {};
  RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
  RDF_PLAIN_LITERAL = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral';
  RDF_TYPED_LITERAL = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#TypedLiteral';
  RDF_XML_LITERAL = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral';
  RDF_OBJECT = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#object';

  constructor() { }

  getIriShortName(iri, hashify?) {
    let rval = iri;

    // find the last occurence of # or / - short name is everything after it
    if (iri.indexOf('#') >= 0) {
      if (hashify) {
        rval = '#' + iri.split('#').pop();
      } else {
        rval = iri.split('#').pop();
      }
    } else if (iri.indexOf('/') >= 0) {
      rval = iri.split('/').pop();
    }

    // don't allow the entire IRI to be optimized away
    if (rval.length < 1) {
      rval = iri;
    }

    return rval;
  }

  nodelistToXMLLiteral(nodelist) {
    let str = '';
    nodelist.forEach(node => {
      str += node.outerHTML || node.nodeValue;
    });
    return str;
  }

  createNode(s, p, data, rval, ancestors) {
    const triples = data.getSubject(s);
    const predicates = triples === null ? [] : triples.predicates;
    let name = '';
    const node = {
      'name': '',
      'children': []
    };

    // calculate the short name of the node
    // prepend the predicate name if there is one
    if (p !== undefined) {
      name = this.getIriShortName(p) + ': ';
    }

    // keep track of subjects that we're branching from
    // to avoid recursing into them again.
    if (!ancestors) {
      ancestors = [];
    }
    ancestors = ancestors.concat(s);

    if (s.charAt(0) === '_') {
      name += 'Item ' + this.bnodeNames[s];
    } else if (p === this.RDF_TYPE) {
      name += this.getIriShortName(s);
    } else {
      name += this.getIriShortName(s, true);
    }
    node.name = name;

    // create nodes for all predicates and objects
    for (p in predicates) {
      // do not include which vocabulary was used in the visualization
      if (p === 'http://www.w3.org/ns/rdfa#usesVocabulary') {
        continue;
      }

      const objects = triples.predicates[p].objects;

      objects.forEach(o => {
        const value = '';
        if (o.type === this.RDF_OBJECT && ancestors.indexOf(o.value) === -1) {
          // recurse to create a node for the object if it's an object
          // and is not referring to itself
          this.createNode(o.value, p, data, node, ancestors);
          this.embedded[o.value] = true;
        } else {
          // generate the leaf node
          // tslint:disable-next-line:no-shadowed-variable
          let name = '';
          if (o.type === this.RDF_XML_LITERAL) {
            // if the property is an XMLLiteral, serialise it
            name = this.nodelistToXMLLiteral(o.value);
          } else if (o.type === this.RDF_OBJECT) {
            // shorten any IRIs (if the property is referring to the
            // object itself)
            name = this.getIriShortName(o.value, true);
          } else {
            name = o.value;
          }

          const child = {
            'name': this.getIriShortName(p) + ': ' + name
          };
          node.children.push(child);
        }
      });
    }

    // remove the children property if there are no children
    if (node.children.length === 0) {
      node.children = undefined;
    }
    // collapse children of nodes that have already been embedded
    if (this.embedded[s] !== undefined && node.children !== undefined) {
      node.children = node.children;
      node.children = undefined;
    }

    rval.children.push(node);
  }

  toD3TreeGraph(data) {
    this.bnodeNames = {};
    this.bnodeCount = 1;
    const rval = {
      'name': 'Web Page',
      'children': []
    };

    const subjects = data.getSubjects();
    this.embedded = {};



    // Pre-generate names for all bnodes in the graph
    subjects.forEach(s => {
      // calculate the short name of the node
      if (s.charAt(0) === '_' && !(s in this.bnodeNames)) {
        this.bnodeNames[s] = this.bnodeCount;
        this.bnodeCount += 1;
      }
    });

    // Generate the D3 tree graph
    subjects.forEach(s => {
      this.createNode(s, undefined, data, rval, null);
    });

    // clean up any top-level children with no data
    const cleaned = [];
    rval.children.forEach(child => {
      if (child.children !== undefined) {
        cleaned.push(child);
      }
    });
    rval.children = cleaned;

    return rval;
  }

}
