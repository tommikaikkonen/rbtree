describe("TreeNode", function() {
  var treeNode;

  beforeEach(function() {
    treeNode = new TreeNode(2, 1);
  });

  it("should be red", function() {
    expect(treeNode.color).toEqual(RED_COLOR);
  });

  it("should not have a parent", function() {
    expect(treeNode.p).toEqual(null);
  });

  it("should have two black null nodes", function() {
    expect(treeNode.l.val).toEqual(null);
    expect(treeNode.l.color).toEqual(BLACK_COLOR);

    expect(treeNode.r.val).toEqual(null);
    expect(treeNode.r.color).toEqual(BLACK_COLOR);
  });

  it("should have two null nodes that have the correct parent", function() {
    expect(treeNode.l.p).toBe(treeNode);
    expect(treeNode.r.p).toBe(treeNode);
  });

  describe("unit tests", function() {
    var parentNode, siblingNode;

    beforeEach(function() {
      parentNode = new TreeNode(3, 2);
      siblingNode = new TreeNode(4, 3);

      parentNode.r = siblingNode;
      siblingNode.p = parentNode;
      treeNode.p = parentNode;
      parentNode.l = treeNode;
    });

    it("isLeaf", function() {
      expect(treeNode.l.isLeaf()).toEqual(true);
      expect(treeNode.r.isLeaf()).toEqual(true);
      expect(treeNode.isLeaf()).toEqual(false);
    });

    it("getDepth", function() {
      expect(treeNode.getDepth()).toEqual(1);
      expect(treeNode.p.getDepth()).toEqual(0);
    });

    it("getUncle", function() {
      expect(treeNode.l.getUncle()).toBe(siblingNode);
      expect(treeNode.r.getUncle()).toBe(siblingNode);
    });

    it("getGrandParent", function() {
      expect(treeNode.l.getGrandParent()).toBe(parentNode);
      expect(treeNode.l.getGrandParent()).not.toBe(siblingNode);
    });

    it("isSame", function() {
      expect(treeNode.isSame(treeNode)).toEqual(true);
      expect(treeNode.isSame(parentNode)).toEqual(false);
    });

    it("traverse", function() {
      var counter = 0;
      var traverseTester = function(node) {
        node.traverseOrder = counter++;
      };
      parentNode.traverse(traverseTester);

      expect(parentNode.traverseOrder).toEqual(0);
      expect(treeNode.traverseOrder).toEqual(1);
      expect(treeNode.l.traverseOrder).toEqual(2);
      expect(treeNode.r.traverseOrder).toEqual(3);
      expect(siblingNode.traverseOrder).toEqual(4);
      expect(siblingNode.l.traverseOrder).toEqual(5);
      expect(siblingNode.r.traverseOrder).toEqual(6);
    });

    it("switchColor", function() {
      expect(treeNode.color).toEqual(RED_COLOR);
      treeNode.switchColor();
      expect(treeNode.color).toEqual(BLACK_COLOR);
      treeNode.switchColor();
      expect(treeNode.color).toEqual(RED_COLOR);
    });

  });

});

describe("Tree", function() {

  describe("Empty tree", function() {
    var tree;
    it("should create a null root node for empty tree", function() {
      tree = new Tree();
      expect(tree.root.val).toEqual(null);
      expect(tree.root.color).toEqual(BLACK_COLOR);
    });
  });

  describe("Tree with nodes", function() {
    var rootNode, tree, counter;
    beforeEach(function() {
      counter = 0;
      tree = new Tree();
      rootNode = tree.insert(5);
    });

    it("should have rootNode as root", function() {
      expect(tree.root).toBe(rootNode);
    });

    describe("unit tests", function() {
      
      it("getHeight", function() {
        expect(tree.getHeight()).toBe(1);
      });

      it("insert", function() {
        var insertedNode = tree.insert(4);
        expect(tree.root.l).toBe(insertedNode);
        expect(tree.root.l.p).toBe(tree.root);

        var insertedNode2 = tree.insert(6);
        expect(tree.root.r).toBe(insertedNode2);
        expect(tree.root.r.p).toBe(tree.root);
      });
    });
  });
});
