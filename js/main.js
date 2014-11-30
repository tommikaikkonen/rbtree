var main = function main() {
    var caseVals = {
        case1: [],
        case2: [50],
        case3: [50, 25, 75],
        case4: [50, 25, 75, 40, 45, 47],
        case5: [50, 25, 75, 40, 45, 47]
    };

    var treeVals = [100, 50, 78, 30, 15, 87, 33];
    var treeView = RedBlackTreeDrawer.createTreeView(treeVals);

    // What to do when clicking on a case button
    d3.selectAll('.js-case').on('mouseup', function(d) {
        d3.select(this.parentNode.parentNode).selectAll('li').each(function() {
            d3.select(this).classed('active', false);
        });

        // Convert DOMTokenList (this.classList) to array
        var classes = Array.prototype.slice.call(this.classList, 0);
        var caseNo;
        for (var i=0; i < classes.length; i++) {
            // Match js-case1 but not js-case, and get the case number
            var caseMatch = classes[i].match(/js-case(\d{1})/);
            if (caseMatch) caseNo = caseMatch[1];
        }
        d3.select(this.parentNode).classed('active', true);

        treeView = RedBlackTreeDrawer.createTreeView(caseVals['case'+caseNo]);
        drawToSvg('#graph', treeView);
    });

    d3.select(window).on('resize', function() {
        WIDTH = this.innerWidth - 300;
        HEIGHT = this.innerHeight;
        treeView.reset();
        drawToSvg('#graph', treeView);
    });

    drawToSvg('#graph', treeView);
};

main();

