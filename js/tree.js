/**
 * The minimum possible value for a TreeNode instance.
 * @const
 * @type {Number}
 */
var MIN_TREE_VAL = 0,
    
    /**
     * The maximum possible value for a TreeNode instance.
     * @const
     * @type {Number}
     */
    MAX_TREE_VAL = 1000,

    /**
     * The string indicating a black color in a TreeNode instance.
     * @const
     * @type {String}
     */
    BLACK_COLOR = 'black',
    /**
     * The string indicating a red color in a TreeNode instance.
     * @const
     * @type {String}
     */
    RED_COLOR = 'red';

// ***********************
//
// Data classes
//
// ***********************

/**
 * Creates a new TreeNode.
 * @constructor
 * @param {number} val - Value of the node.
 * @param {number} id - Id of the node.
 */
var TreeNode = function(val, id) {

    /**
     * Value of the node.
     * @type {number}
     */
    this.val = val;
    /**
     * Id of the node.
     * @type {number}
     */
    this.id = id || null;

    /**
     * Parent of the node.
     * @type {TreeNode}
     */
    this.p = null;

    /**
     * Color of the node. Can be red or black.
     * @type {string}
     */
    this.color = BLACK_COLOR;

    if (!_.isNull(this.val)) {
        /**
         * Left child of the node.
         * @type {TreeNode}
         */
        this.l = new TreeNode(null);
        this.l.p = this;
        /**
         * Right child of the node.
         * @type {TreeNode}
         */
        this.r = new TreeNode(null);
        this.r.p = this;

        this.color = RED_COLOR;
    }
};

TreeNode.prototype = {

    /**
     * Gets the depth of the node instance.
     * @return {number}
     */
    getDepth: function getDepth() {
        var node = this;
        var depth = 0;
        while (node.p && node.p.val !== null) {
            node = node.p;
            depth++;
        }
        return depth;
    },

    /**
     * Get the grandparent of the node instance.
     * @return {TreeNode|null}
     */
    getGrandParent: function getGrandParent() {
        if (!_.isNull(this.p)) return this.p.p;
        return null;
    },

    /**
     * Get the uncle of the node instance.
     * @return {TreeNode|null}
     */
    getUncle: function getUncle() {
        var grandParent = this.getGrandParent();
        if (grandParent) {
            if (this.p.isSame(grandParent.l)) {
                return grandParent.r;
            } else {
                return grandParent.l;
            }
        } else {
            return null;
        }
    },

    /**
     * Returns a boolean indicating if the instance is a leaf.
     * @return {Boolean}
     */
    isLeaf: function isLeaf() {
        if (this.p && !this.l && !this.r) return true;
        return false;
    },

    /**
     * Returns a boolean indicating if the argument node is equal to this instance.
     * @param  {TreeNode}  other_node - The other node instance to compare to.
     * @return {Boolean}
     */
    isSame: function isSame(other_node) {
        return this.id === other_node.id;
    },

    /**
     * Traverses the (sub-)tree with the instance as root in preorder.
     * @param  {function} operation - a function called with each node as the first argument.
     */
    traverse: function traverse(operation) {
        operation(this);
        if (this.l) this.l.traverse(operation);
        if (this.r) this.r.traverse(operation);
    },

    /**
     * Switches the instances color property.
     */
    switchColor: function switchColor() {
        this.color = this.color === RED_COLOR ? BLACK_COLOR : RED_COLOR;
    }

};

/**
 * Creates a Tree instance.
 * @constructor
 * @param {TreeNode} [root] - The TreeNode instance assigned as root of the tree.
 */
var Tree = function(root) {

    /**
     * The Id for the next TreeNode instance to be inserted to this instance.
     * @type {Number}
     */
    this.idCounter = 0;

    if (root) {
        /**
         * The root node of the tree.
         * @type {TreeNode}
         */
        this.root = root;
    } else {
        this.root = new TreeNode(null, this.idCounter++);
    }
};

Tree.prototype = {

    /**
     * Returns the height of the tree.
     * @return {number}
     */
    getHeight: function getHeight() {

        var maxDepth = 0;
        var getMaxDepth = function getMaxDepth(node) {
            if (node.getDepth() > maxDepth) {
                maxDepth = node.getDepth();
            }
        };
        this.traverse(getMaxDepth);
        return maxDepth;
    },

    /**
     * Traverses the tree in preorder.
     * @param  {function} operation - a function called with
     * each node instance as the first argument.
     */
    traverse: function traverse(operation) {
        this.root.traverse(operation);
    },

    /**
     * Inserts a new TreeNode instance to the tree.
     * @param  {number} value - The value of the TreeNode instance to be created.
     * @param  [TreeNode] root - The root for the insertion operation.
     * @return {TreeNode} - The TreeNode instance that was inserted.
     */
    insert: function insert(value) {
        var node = new TreeNode(value, this.idCounter++);

        if (_.isNull(this.root.val)) {
            this.root = node;
            return node;
        }

        this.insertRecursive(node, this.root);
        return node;

    },

    /**
     * Executes the recursive algorithm to insert a TreeNode instance into a
     * binary search tree.
     * @param  {TreeNode} node - The TreeNode instance to be inserted.
     * @param  {TreeNode} root - The root of the (sub)tree to apply the insertion to.
     */
    insertRecursive: function insertRecursive(node, root) {
        // On each recursive call, we update the parent property of the node
        // to the root argument.
        node.p = root;

        if (node.val < root.val) {
            if (root.l && !_.isNull(root.l.val)) {
                this.insertRecursive(node, root.l);
            } else {
                root.l = node;
            }
        } else if (node.val > root.val) {
            if (root.r && !_.isNull(root.r.val)) {
                this.insertRecursive(node, root.r);
            } else {
                root.r = node;
            }
        }
        // The node is not inserted if node.val === root.val.
    },

    /**
     * Makes the Red-Black Tree valid after insertion.
     * @param  {TreeNode} node - The TreeNode instance that was inserted.
     */
    makeRbValid: function makeRbValid(node) {
        var self = this;

        function handleCase1(node) {
            if (_.isNull(node.p)) {
                node.color = BLACK_COLOR;
            } else {
                handleCase2(node);
            }
        }

        function handleCase2(node) {
            if (node.p.color === BLACK_COLOR) {
                return;
            } else {
                handleCase3(node);
            }
        }
        
        function handleCase3(node) {
            var uncle = node.getUncle();
            var grandParent = node.getGrandParent();

            if (uncle && uncle.color === RED_COLOR) {
                node.p.color = BLACK_COLOR;
                uncle.color = BLACK_COLOR;
                grandParent.color = RED_COLOR;

                handleCase1(grandParent);
            } else {
                handleCase4(node);
            }
        }

        function handleCase4(node) {
            var grandParent = node.getGrandParent();

            if (node.isSame(node.p.r) && node.p.isSame(grandParent.l)) {
                self.rotateLeft(node.p);
                node = node.l;
            } else if (node.isSame(node.p.l) && node.p.isSame(grandParent.r)) {
                self.rotateRight(node.p);
                node = node.r;
            }

            handleCase5(node);
        }

        function handleCase5(node) {
            var grandParent = node.getGrandParent();
            node.p.color = BLACK_COLOR;
            grandParent.color = RED_COLOR;

            if (node.isSame(node.p.l)) {
                self.rotateRight(grandParent);
            } else {
                self.rotateLeft(grandParent);
            }
        }

        handleCase1(node);
    },

    /**
     * Returns a boolean indicating if the Tree instance is a valid
     * binary search tree.
     * @param  {TreeNode}  [node] - The root node of the subtree to be inspected.
     * @param  {number}  [minVal] - The minimum possible value of a TreeNode instance.
     * @param  {number}  [maxVal] - The maximum possible value of a TreeNode instance.
     * @return {Boolean}
     */
    isBST: function isBST(root, minVal, maxVal) {
        root = root || this.root;
        minVal = minVal || MIN_TREE_VAL;
        maxVal = maxVal || MAX_TREE_VAL;

        // If root is a null TreeNode, it means we have reached a leaf, and
        // that this subtree is a valid binary search tree.
        if (root.val === null) return true;

        if (root.val < minVal || root.val > maxVal) return false;

        // The tree is a valid binary search tree, if the root node and its two
        // subtrees fulfill BST properties together. We can inspect this recursively.
        return this.isBST(root.l, minVal, root.val) && this.isBST(root.r, root.val, maxVal);
    },

    /**
     * Returns a boolean indicating if the first Red-Black Tree property
     * "All nodes are red or black" is valid.
     * @return {Boolean}
     */
    isRb1Valid: function isRb1Valid() {
        // By TreeNode class definition, all nodes are red or black.
        return true;
    },

    /**
     * Returns a boolean indicating if the second Red-Black Tree property
     * "The root is black" is valid.
     * @return {Boolean}
     */
    isRb2Valid: function isRb2Valid() {
        if (this.root.color === BLACK_COLOR) return true;
        return false;
    },

    /**
     * Returns a boolean indicating if the third Red-Black Tree property
     * "All leaves are black" is valid.
     * @return {Boolean}
     */
    isRb3Valid: function isRb3Valid() {
        var isValid = true;
        var leafsAreBlack = function leafsAreBlack(node) {
            if (node.isLeaf() && (node.color !== BLACK_COLOR)) {
                isValid = false;
            }
        };
        this.traverse(leafsAreBlack);

        return isValid;
    },

    /**
     * Returns a boolean indicating if the fourth Red-Black Tree property
     * "Each red node has two black children" is valid.
     * @return {Boolean}
     */
    isRb4Valid: function isRb4Valid() {
        var isValid = true;
        var redNodesChildrenAreBlack = function redNodesChildrenAreBlack(node) {
            var isRed = (node.color === RED_COLOR);
            if (isRed && (node.l.color !== BLACK_COLOR || node.r.color !== BLACK_COLOR)) {
                isValid = false;
            }
        };
        this.traverse(redNodesChildrenAreBlack);

        return isValid;
    },

    /**
     * Returns a boolean indicating if the fifth Red-Black Tree property
     * "Every path from root to leaf contain the same number of black nodes" is valid.
     * @return {Boolean}
     */
    isRb5Valid: function isRb5Valid() {
        var leafNodes = [];
        var getLeafNodes = function getLeafNodes(node) {
            if (node.isLeaf()) leafNodes.push(node);
        };
        this.traverse(getLeafNodes);

        var lastNumberOfBlackNodesOnPath = null;
        var numberOfBlackNodesOnPath = 0;

        for (i=0; i < leafNodes.length; i++) {
            var leaf = leafNodes[i];
            while (!_.isNull(leaf.p)) {
                if (leaf.color === BLACK_COLOR) numberOfBlackNodesOnPath++;
                leaf = leaf.p;
            }
            if (!_.isNull(lastNumberOfBlackNodesOnPath) && lastNumberOfBlackNodesOnPath !== numberOfBlackNodesOnPath) {
                return false;
            }
            lastNumberOfBlackNodesOnPath = numberOfBlackNodesOnPath;
            numberOfBlackNodesOnPath = 0;
        }
        return true;
    },

    /**
     * Returns a boolean indicating if a tree rotation is possible
     * given a certain root TreeNode instance and a direction of the rotation.
     * @param  {TreeNode}  root - The root node of the rotation.
     * @param  {string}  direction
     * @return {Boolean}
     */
    _isRotateable: function _isRotateable(root, direction) {
        var oppositeSide = (direction === 'l' ? 'r' : 'l');
        var pivot = root[oppositeSide];
        if (root[direction] && root[oppositeSide] && !_.isNull(root[oppositeSide].val) && pivot.l && pivot.r) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * Returns a boolean indicating if a left rotation can be applied
     * to a TreeNode instance as the root.
     * @param  {TreeNode}  root - The root node instance of the rotation.
     * @return {Boolean}
     */
    isLeftRotateable: function isLeftRotateable(root) {
        return this._isRotateable(root, 'l');
    },

    /**
     * Returns a boolean indicating if a right rotation can be applied
     * to a node as root.
     * @param  {TreeNode}  root - The root node instance of the rotation.
     * @return {Boolean}
     */
    isRightRotateable: function isRightRotateable(root) {
        return this._isRotateable(root, 'r');
    },

    /**
     * Executes a tree rotation in relation to a root node.
     * @param  {TreeNode} root
     * @param  {string} direction
     */
    rotateWithRoot: function rotateWithRoot(root, direction) {
        if (!this._isRotateable(root, direction)) return;

        var rootParent = root.p;

        // The root argument is the root of the whole tree,
        // if its parent is null.
        var isRootTheTreeRoot = _.isNull(rootParent);

        var correctSide = direction,
            oppositeSide = direction === 'l' ? 'r': 'l';

        var pivot = root[oppositeSide];

        // Set the right (left) child of the pivot to the
        // left (right) child of the root in right (left) rotation.
        root[oppositeSide] = pivot[correctSide];
        // Set root to be that nodes parent instead of pivot.
        root[oppositeSide].p = root;

        // Set the roots parent to be pivot.
        root.p = pivot;

        // Set pivots right (left) child to be root in a right (left) rotation.
        pivot[correctSide] = root;

        // The pivot is now essentially the root.
        newRoot = pivot;
        newRoot.p = rootParent;

        // Finally, fix the connection between the new root and its parent node.
        if (!isRootTheTreeRoot) {
            // if root is the left (right) child of its parent,
            // set the new root as the left (right) child of
            // that parent.
            if (rootParent.l.val === root.val) {
                rootParent.l = newRoot;
            } else {
                rootParent.r = newRoot;
            }
        } else {
            // If we rotated the tree with respect to the root
            // of the whole tree, we need to update the pointer
            // to the tree's root.
            this.root = newRoot;
        }
    },

    /**
     * Executes a left rotation in relation to a root node.
     * @param  {TreeNode} root
     */
    rotateLeft: function rotateLeft(root) {
        this.rotateWithRoot(root, 'l');
    },

    /**
     * Executes a left rotation in relation to a root node.
     * @param  {TreeNode} root
     */
    rotateRight: function rotateLeft(root) {
        this.rotateWithRoot(root, 'r');
    }
};