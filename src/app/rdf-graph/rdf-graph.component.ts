import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rdf-graph',
  templateUrl: './rdf-graph.component.html',
  styleUrls: ['./rdf-graph.component.css']
})
export class RdfGraphComponent implements OnChanges {


  @Input() data;

  tree;
  // setup the visualization viewport
  m = [20, 120, 20, 120];
  w = 1024 - this.m[1] - this.m[3];
  h = 450 - this.m[0] - this.m[2];
  i = 0;
  root;
  diagonal = d3.svg.diagonal()
  .projection(function (d) { return [d.y, d.x]; });
  view;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes.data.currentValue);
    this.redraw(this.data);
  }

  /**
   * Redraw the graph visualization on the screen.
   */
  redraw(nodes) {
    // delete any old SVG document
    // $('#graph').empty();

    // create a new tree layout
    this.tree = d3.layout.tree()
      .size([this.h, this.w])
      .separation(function (a, b) {
        const descendants = function (node) {
          let count = 0;
          // tslint:disable-next-line:forin
          for (const d in node.children) {
            count++;
            count += descendants(node.children[d]);
          }
          return count;
        };
        const aDesc = Math.max(descendants(a), a.parent === b.parent ? 1 : 2);
        const bDesc = Math.max(descendants(b), a.parent === b.parent ? 1 : 2);
        return (aDesc + bDesc) / 2;
      });

    // create the projection
    // const diagonal = d3.svg.diagonal()
    //   .projection(function (d) { return [d.y, d.x]; });

    // create the view for the graph
    this.view = d3.select('#graph').append('svg:svg')
      .attr('width', this.w + this.m[1] + this.m[3])
      .attr('height', this.h + this.m[0] + this.m[2])
      .append('svg:g')
      .attr('transform', 'translate(' + this.m[3] + ',' + this.m[0] + ')');

    // set the root value
    this.root = nodes;

    // if root is invalid, fix it
    if (this.root === undefined) {
      this.root = { 'name': 'Web Page' };
    }

    // set the RDF data
    this.tree.nodes(this.root);

    // set the root X and Y starting location? I don't really know what this does.
    this.root.x0 = this.h / 2;
    this.root.y0 = 0;

    // update the visualization
    this.update(this.root);
  }

  update(source) {
    const duration = d3.event && d3.event.altKey ? 5000 : 500;

    // Compute the new tree layout.
    const nodes = this.tree.nodes(this.root).reverse();

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 180; });

    // Update the nodes…
    const node = this.view.selectAll('g.node')
      .data(nodes, (d) => d.id || (d.id = ++this.i));

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('svg:g')
      .attr('class', 'node')
      .attr('transform',  (d) => 'translate(' + source.y0 + ',' + source.x0 + ')')
      .on('click', (d) => { this.toggle(d); this.update(d); });

    nodeEnter.append('svg:circle')
      .attr('r', 1e-6)
      .style('fill',  (d) => d._children ? 'lightsteelblue' : '#fff');

    nodeEnter.append('svg:text')
      .attr('x', function (d) { return d.children || d._children ? -10 : 10; })
      .attr('dy', '.35em')
      .attr('text-anchor', function (d) { return d.children || d._children ? 'end' : 'start'; })
      .text(function (d) { return d.name; })
      .style('fill-opacity', 1e-6);

    // Transition nodes to their new position.
    const nodeUpdate = node.transition()
      .duration(duration)
      .attr('transform', function (d) { return 'translate(' + d.y + ',' + d.x + ')'; });

    nodeUpdate.select('circle')
      .attr('r', 4.5)
      .style('fill', function (d) { return d._children ? 'lightsteelblue' : '#fff'; });

    nodeUpdate.select('text')
      .style('fill-opacity', 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', function (d) { return 'translate(' + source.y + ',' + source.x + ')'; })
      .remove();

    nodeExit.select('circle')
      .attr('r', 1e-6);

    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // Update the links…
    const link = this.view.selectAll('path.link')
      .data(this.tree.links(nodes), function (d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert('svg:path', 'g')
      .attr('class', 'link')
      .attr('d', (d) => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal({ source: o, target: o });
      })
      .transition()
      .duration(duration)
      .attr('d', this.diagonal);

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr('d', this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr('d',  (d) => {
        const o = { x: source.x, y: source.y };
        return this.diagonal({ source: o, target: o });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children.
  toggle(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }

}
