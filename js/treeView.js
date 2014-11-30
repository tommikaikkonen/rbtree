/**
 * Padding within the drawing area.
 * @const
 * @type {Number}
 */
var PADDING = 50,
    /**
     * Width of the drawing area in pixels.
     * @type {Number} - Number of pixels
     */
    WIDTH = window.innerWidth-300,
    /**
     * Height of the drawing area in pixels.
     * @type {Number} - Number of pixels.
     */
    HEIGHT = window.innerHeight;


// **********************************
//
// Classes for presentation
//
// **********************************


/**
 * Create a NodeView instance.
 * @constructor
 * @param {TreeNode} node - The TreeNode instance the view represents.
 * @param {number} id - Id for this instance.
 */
var NodeView = function(node, id) {
    /**
     * The TreeNode instance the view represents.
     * @type {TreeNode}
     */
    this.node = node;
    /**
     * Id for this instance.
     * @type {number}
     */
    this.id = id;
};

NodeView.prototype = {

    /**
     * Sets coordinates for the view instance on the drawing area.
     * @param {number} x - X-coordinate.
     * @param {number} y - Y-coordinate.
     */
    setCoordinates: function setCoordinates(x, y) {
        this.x = x;
        this.y = y;
    },

    /**
     * Returns the x-coordinate property.
     * @return {number}
     */
    getX: function getX() {
        return this.x;
    },

    /**
     * Returns the y-coordinate property.
     * @return {number}
     */
    getY: function getY() {
        return this.y;
    },

    /**
     * Traverses the (sub-)trees NodeViews with the instance as root in preorder.
     * @param  {function} operation - a function called with each NodeView as the first argument.
     */
    traverse: function traverse(operation) {
        operation(this);
        if (this.l) this.l.traverse(operation);
        if (this.r) this.r.traverse(operation);
    }
};

/**
 * Creates an EdgeView instance. Represents a directed edge connecting
 * two NodeViews.
 * 
 * @constructor
 * @param {NodeView} from - The NodeView instance the edge starts from.
 * @param {NodeView} to - The NodeView instance the edge ends at.
 * @param {number} id - Unique Id for the EdgeView instance.
 */
var EdgeView = function EdgeView(from, to, id) {
    /**
     * The NodeView instance the edge starts from.
     * @type {NodeView}
     */
    this.from = from;

    /**
     * The NodeView instance the edge ends at.
     * @type {NodeView}
     */
    this.to = to;

    /**
     * Unique ID for the instance.
     * @type {number}
     */
    this.id = id;
};

/**
 * Creates a TreeView instance. Keeps track of all NodeViews and EdgeViews.
 * @param {Tree} tree - The tree the instance represents.
 */
var TreeView = function TreeView(tree) {
    /**
     * The tree the instance represents.
     * @type {Tree}
     */
    this.tree = tree;

    /**
     * An array to keep track of all NodeView instances.
     * @type {NodeView[]}
     */
    this.nodeViews = [];
    /**
     * An array to keep track of all EdgeView instances.
     * @type {EdgeView[]}
     */
    this.edgeViews = [];
};

TreeView.prototype = {

    /**
     * Initializes the TreeView.
     */
    init: function init() {
        /**
         * The root NodeView of the TreeView.
         * @type {NodeView}
         */
        this.root = null;

        /**
         * The ID value of the next EdgeView to be created. 
         * @type {Number}
         */
        this.edgeIdCounter = 0;

        /**
         * The ID value of the next EdgeView to be created. 
         * @type {Number}
         */
        this.nodeIdCounter = 0;
        this.createViewsRecursive(this.tree.root);
    },

    /**
     * Creates NodeViews and EdgeViews from tree data.
     * @param  {TreeNode} node - The root node of the subtree under operation.
     * @return {NodeView} The NodeView instance created.
     */
    createViewsRecursive: function createViewsRecursive(node) {
        var parentView = new NodeView(node, this.nodeIdCounter++);

        // If no root has been assigned for the tree representation,
        // assign the new NodeView.
        if (!this.root) this.root = parentView;

        // If a child node exists, create a view for it,
        // save a pointer in it to the parent node, and
        // save a pointer in the parent node to it.
        // Then create a corresponding EdgeView for the
        // connection.
        if (node.l) {
            // Create Views for the left subtree.
            leftView = this.createViewsRecursive(node.l);

            leftView.p = parentView;
            parentView.l = leftView;
            
            this.edgeViews.push(new EdgeView(leftView, parentView, this.edgeIdCounter++));
        }
        if (node.r) {
            // Create Views for the right subtree.
            rightView = this.createViewsRecursive(node.r);

            rightView.p = parentView;
            parentView.r = rightView;

            this.edgeViews.push(new EdgeView(rightView, parentView, this.edgeIdCounter++));
        }

        this.nodeViews.push(parentView);
        return parentView;
    },

    /**
     * Calculate coordinates for all NodeViews.
     */
    calcNodeCoordinates: function calcNodeCoordinates() {

        // Set the starting coordinate for the root NodeView.
        // All other coordinates are calculated in relation to this
        // starting coordinate.
        this.root.setCoordinates(WIDTH/2, 0);
        var tree = this.tree;

        var calcCoords = function calcCoords(nodeView) {

            if (!nodeView.p) return;

            var parentX = nodeView.p.getX();
            var parentY = nodeView.p.getY();

            var nodeLevel = nodeView.node.getDepth();

            // The x-coordinate is based on the maximum possible number
            // of nodes on the current level.
            var maxNodesOnLevel = Math.pow(2, nodeLevel);

            var xInterval = WIDTH / (maxNodesOnLevel + 1);
            var yInterval = (HEIGHT-PADDING) / (tree.getHeight() + 1);

            // If nodeView is its parents left child
            if (nodeView.p.l && nodeView.id === nodeView.p.l.id) {
                nodeView.setCoordinates(parentX-xInterval/2, parentY + yInterval);

            // If nodeView is its parents right child
            } else if (nodeView.p.r && nodeView.id === nodeView.p.r.id) {
                nodeView.setCoordinates(parentX+(xInterval/2), parentY + yInterval);
            }
        };

        this.traverse(calcCoords);
    },

    /**
     * Traverses the tree in preorder.
     * @param  {function} operation - a function called with
     * each NodeView instance as the first argument.
     */
    traverse: function traverse(operation) {
        this.root.traverse(operation);
    },

    /**
     * Resets the TreeView to represent the data.
     */
    reset: function reset() {
        this.nodeViews = [];
        this.edgeViews = [];
        this.init();
        this.calcNodeCoordinates();
    }
};