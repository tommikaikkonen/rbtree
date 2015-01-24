
/**
 * Encapsulate code relating to the Red-Black Tree Drawer.
 */
var RedBlackTreeDrawer = function(TreeNode, Tree, NodeView, TreeView, EdgeView) {
    // This object is returned at the end.
    var obj = {};

    // Attach all the relevant classes.
    obj.TreeNode = TreeNode;
    obj.Tree = Tree;
    obj.NodeView = NodeView;
    obj.TreeView = TreeView;
    obj.EdgeView = EdgeView;

    /**
     * Creates a Red-Black Tree from a value list.
     * @param  {number[]} values
     * @return {Tree}
     */
    obj.createTree = function createTree(values) {
        var tree = new Tree();

        for (var i=0; i < values.length; i++) {
            var node = tree.insert(values[i]);
            tree.makeRbValid(node);
        }

        return tree;
    };

    /**
     * Create a RB Tree and a RB TreeView from a value list.
     * @param  {number[]} values
     * @return {TreeView}
     */
    obj.createTreeView = function createTreeView(values) {
        var tree = this.createTree(values);
        var treeView = new this.TreeView(tree);
        treeView.init();
        treeView.calcNodeCoordinates();

        return treeView;
    };

    obj.update = function update() {
        this.treeView.reset();
    };

    return obj;

}(TreeNode, Tree, NodeView, TreeView, EdgeView);

/**
 * Draws a RB TreeView to an SVG element using d3.js.
 * @param  {string} el - A selector string for the element where to append the SVG element.
 * @param  {TreeView} treeView
 */
var drawToSvg = function drawToSvg(el, treeView) {

    // Lay out the canvas
    var vis = d3.select(el)
            .html("")
            .append('svg')
            .attr('width', "" + (WIDTH) + "px")
            .attr('height', '' + (HEIGHT) + 'px');

        vis.append('svg:g').classed('edges_group', true);
        vis.append('svg:g').classed('circles_group', true);

    var draw = function draw(treeView) {
        var nodes = treeView.nodeViews;
        var edges = treeView.edgeViews;

        var keyFunc = function keyFunc(d, i) {
            return d.id;
        };

        // Show which RB tree properties are and are not
        // fulfilled by the current tree.
        var checkProperties = function checkProperties(treeView) {
            var tree = treeView.tree;

            var properties = [
                {
                    caseName: 'rbisbst',
                    val: tree.isBST()
                },
                {
                    caseName: 'rb1',
                    val: tree.isRb1Valid()
                },
                {
                    caseName: 'rb2',
                    val: tree.isRb2Valid()
                },
                {
                    caseName: 'rb3',
                    val: tree.isRb3Valid()
                },
                {
                    caseName: 'rb4',
                    val: tree.isRb4Valid()
                },
                {
                    caseName: 'rb5',
                    val: tree.isRb5Valid()
                }
            ];

            // Generate the UI elements for showing
            // the properties.
            d3.selectAll('.js-property').each(function() {
                for (var i=0; i < this.classList.length; i++) {
                    // Get the property number for the element
                    var match = this.classList[i].match(/js-property-([a-zA-Z0-9]+)/);
                    var icon = d3.select(this).select('i');

                    // To start, revert all classes to the original state.
                    icon.classed({
                        'fa-times-circle': false,
                        'fa-check-circle': false,
                        'text-success': false,
                        'text-danger': false
                    });

                    if (match) {
                        var prop = _.findWhere(properties, {caseName: 'rb' + match[1]});
                        if (prop.val) {
                            icon.classed({
                                'fa-check-circle': true,
                                'text-success': true
                            });
                        } else {
                            icon.classed({
                                'fa-times-circle': true,
                                'text-danger': true
                            });
                        }

                    }
                }
            });
        };

        checkProperties(treeView);

        var edgs = vis.select('g.edges_group').selectAll("line").data(edges, keyFunc);

        var edgsEnter = edgs.enter()
                        .append('line')
                            .style("stroke", "black")
                            .style('stroke-width', 2)
                            .style('opacity', 0)
                            .transition()
                                .duration(500)
                                .style('opacity', 1);

        edgs.attr("x1", function(d) { return d.from.getX(); })
            .attr("y1", function(d) { return d.from.getY() + PADDING; })
            .attr("x2", function(d) { return d.to.getX(); })
            .attr("y2", function(d) { return d.to.getY() + PADDING; });

        edgs.exit()
            .transition()
                .duration(500)
                .style('opacity', 0)
                .remove();

        var generateTransformAttribute = function generateTransformAttribute(d) {
            var str = "translate(";
            str += ([d.getX(), d.getY() + PADDING] + ')');
            return str;
        };

        var g = vis.select('g.circles_group').selectAll('g.circle_group').data(nodes, keyFunc);


        // For new elements (enter)
        var gEnter = g.enter()
            .append('svg:g').classed('circle_group', true);

        var nodeCircle = gEnter.append('svg:circle')
            .classed('node_circle', true)
            .attr('r', '20px')
            .style('stroke-width', 2)
            .style('stroke', 'black');

        // For all elements (update)
        g.select('circle.node_circle')
            .transition()
            .duration(250)
                .style('fill', function(d) {
                    return d.node.color;
                });

        var switchColorCircle = gEnter.append('svg:circle')
            .classed('switch_color_circle', true)
            .attr('r', '5px')
            .attr('cy', -30);
            

        g.select('circle.switch_color_circle')
            .style('opacity', 0)
            .style('fill', function(d) {
                return d.node.color === RED_COLOR ? BLACK_COLOR : RED_COLOR;
            })
            .on('mouseup', null)
            .filter(function(d) { return !_.isNull(d.node.val);})
            .style('opacity', 1)
            .on('mouseup', function(d) {
                d.node.switchColor();
                treeView.reset();
                draw(treeView);
            });


        // Add the rotate left UI element
        gEnter.append('svg:use')
            .classed('rotate_left', true)
            .attr({width: 24, height:24})
            .attr('xlink:href', '#icon-arrow-left')
            .style('fill', 'black')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .attr('x', -24-24+3)
            .attr('y', -12)
            .on('mouseup', function(d) {
                treeView.tree.rotateLeft(d.node);
                treeView.reset();
                draw(treeView);
            });

        // Update the rotate left UI element
        g.select('use.rotate_left').style('opacity', 0)
            .on('mouseover', null) // Remove previous binding
            .on('mouseout', null) // Remove previous binding
            .filter(function(d) {
                return treeView.tree.isLeftRotateable(d.node);
            })
            .style('opacity', 0.3)
            .on('mouseover', function(d) {
                d3.select(this).style('opacity', 1);
            })
            .on('mouseout', function(d) {
                d3.select(this).style('opacity', 0.3);
            });

        gEnter.append('svg:use').classed('rotate_right', true)
            .style('fill', 'black')
            .attr({width: 24, height:24})
            .attr('xlink:href', '#icon-arrow-right')
            .attr('fill', 'black')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .attr('x', 24)
            .attr('y', -12)
            .on('mouseup', function(d) {
                treeView.tree.rotateRight(d.node);
                treeView.reset();
                draw(treeView);
            });

        g.select('use.rotate_right').style('opacity', 0)
            .on('mouseover', null)
            .on('mouseout', null)
            .filter(function(d) {
                return treeView.tree.isRightRotateable(d.node);
            })
            .style('opacity', 0.3)
            .on('mouseover', function(d) {
                d3.select(this).style('opacity', 1);
            })
            .on('mouseout', function(d) {
                d3.select(this).style('opacity', 0.3);
            });

        // Insert the text UI element inside tree nodes.
        // Shows the numeric value of the node.
        var nodeValue = gEnter.append('svg:text')
            .classed('node_value', true)
            .attr('fill', "white")
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .style('font-weight', 'bold');

        g.select('text.node_value').text(function(d) {return d.node.val || 'NIL';});

        g.transition()
            .duration(500)
            .attr('transform', generateTransformAttribute);

        g.exit()
            .transition()
            .duration(500)
            .style('opacity', 0.2)
            .remove();

    };

    d3.selectAll('.js-insert-node').on('mouseup', function(d) {
        var nodeValue = prompt('Enter node value: ');
        if (!_.isNull(nodeValue)) {
            console.log('heyy');
            console.log(treeView);
            var node = treeView.tree.insert(+nodeValue);
            treeView.reset();
            draw(treeView);
        }
    });

    draw(treeView);

};