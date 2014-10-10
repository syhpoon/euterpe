/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginAlign = (function() {
    /**
     * PluginAlign [plugin]
     * Align and distribute columns
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} config.totalWidth - Total sheet width
     * @param {Number} [config.nodeMargin=5] - Left margin of non-column nodes
     * @param {Number} [config.sideMargin=3] - Left margin of side nodes
     */
    var PluginAlign = function(config) {
        this.totalWidth = Euterpe.getConfig(config, "totalWidth");
        this.nodeMargin = Euterpe.getConfig(config, "nodeMargin", 5);
        this.sideMargin = Euterpe.getConfig(config, "sideMargin", 3);

        PluginAlign.super.call(this, "Euterpe.PluginAlign", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginAlign, {
        process: function(root, scale) {
            var i, row;

            // Set margins for non-columns (nodes), bars and side items
            for(i=0; i < root.items.length; i++) {
                row = root.items[i];
                var j;

                var nodes = this.collectNodes(row);

                for(j=0; j < nodes.length; j++) {
                    nodes[j].leftMargin = this.nodeMargin;
                }

                this.alignSideItems(row);
            }

            var groups = Euterpe.getGroups(root.items);

            for(i=0; i < groups.length; i++) {
                this.processGroup(groups[i], scale);
            }

            return root;
        },

        /** @private */
        alignSideItems: function(row) {
            var cols = Euterpe.select("Euterpe.Column", row);

            for(var i=0; i < cols.length; i++) {
                var col = cols[i];

                for(var j=0; j < col.items.length; j++) {
                    var item = col.items[j];
                    var z;

                    for(z=0; z < item.leftItems.length; z++) {
                        item.leftItems[z].rightMargin = this.sideMargin;
                    }

                    for(z=0; z < item.rightItems.length; z++) {
                        item.rightItems[z].leftMargin = this.sideMargin;
                    }
                }
            }
        },

        /** @private */
        getColsBars: function(row) {
            var r = [];

            for(var j=1; j < row.items.length; j++) {
                var col = row.items[j];

                if(col.name === "Euterpe.Column" || col.name === "Euterpe.Bar") {
                    r.push(col);
                }
            }

            return r;
        },

        /** @private */
        stretchAlign: function(row, scale) {
            var rowWidth = row.getRealWidth(scale);
            var cols = this.getColsBars(row);
            var diff = this.totalWidth - rowWidth;
            var margin = (diff / cols.length) / scale;

            for(var j=0; j < cols.length; j++) {
                cols[j].leftMargin += margin;
            }
        },

        /** @private */
        getCols: function(items, i) {
            return _.map(items, function(a) {return a[i]});
        },

        /** @private */
        cleanGroup: function(group) {
            var r = [];

            for(var i=0; i < group.items.length; i++) {
                r[i] = this.getColsBars(group.items[i]);
            }

            return r;
        },

        /** @private */
        processGroup: function(group, scale) {
            var items = this.cleanGroup(group);
            var i, j, col, cols;
            var size = _.max(_.map(items, function(row) {
                return row.length;
            }));

            // Align columns between themselves
            for(i=0; i < size; i++) {
                cols = this.getCols(items, i);
                var colDist = {};
                var colWidth = {};
                var rightWidth = {};

                // First determine the biggest offset
                for(j=0; j < cols.length; j++) {
                    col = cols[j];

                    if(typeof col === 'undefined') {
                        continue;
                    }

                    colDist[col.id] = Euterpe.getDistance(col.parent, col, scale)
                                      + col.leftMargin * scale
                                      + col.getLeftWidth(scale);
                    colWidth[col.id] = col.getRealWidth(scale, true);
                    rightWidth[col.id] = col.getRightWidth(scale);
                }

                var distance = _.max(_.values(colDist));
                var width = _.max(_.values(colWidth));
                var rwidth = _.max(_.values(rightWidth));

                // Next add the difference to all required columns
                for(j=0; j < cols.length; j++) {
                    col = cols[j];

                    if(typeof col === 'undefined') {
                        continue;
                    }

                    var d = colDist[col.id];
                    var w = colWidth[col.id];
                    var rw = rightWidth[col.id];

                    if(d < distance) {
                        col.leftMargin += (distance - d) / scale;
                    }

                    if(w < width) {
                        col.rightMargin += (width - w) / scale;
                    }

                    if(rw < rwidth) {
                        col.rightMargin += (rwidth - rw) / scale;
                    }
                }
            }

            // Stretch all the rows
            var self = this;

            _.each(group.items, function(row) {
                self.stretchAlign(row, scale);
            });
        },

        /** @private */
        collectNodes: function(row) {
            return _.filter(row.items,
                function(item) {
                    return item.name !== 'Euterpe.Bar' &&
                           item.name !== 'Euterpe.Column';
                });
        }
    });

    return PluginAlign;
}());
