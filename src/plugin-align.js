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
     */
    var PluginAlign = function(config) {
        this.totalWidth = Euterpe.getConfig(config, "totalWidth");
        this.nodeMargin = Euterpe.getConfig(config, "nodeMargin", 5);

        PluginAlign.super.call(this, "Euterpe.PluginAlign", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginAlign, {
        process: function(root, scale) {
            var i, row;

            // Set margins for non-columns (nodes) and bars
            for(i=0; i < root.items.length; i++) {
                row = root.items[i];
                var j;

                var nodes = this.collectNodes(row);
                var bars = Euterpe.select("Euterpe.Bar", row);

                for(j=0; j < nodes.length; j++) {
                    nodes[j].leftMargin = this.nodeMargin;
                }

                for(j=1; j < bars.length; j++) {
                    bars[j].leftMargin = this.nodeMargin;
                }
            }

            var groups = Euterpe.getGroups(root.items);

            for(i=0; i < groups.length; i++) {
                this.processGroup(groups[i], scale);
            }

            return root;
        },

        /** @private */
        align: function(row, scale) {
            // Step 2. Set margins for columns
            var rowWidth = row.getRealWidth(scale);
            var cols = Euterpe.select("Euterpe.Column", row);
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
                var row = group.items[i];

                r[i] = Euterpe.select("Euterpe.Column", row);
            }

            return r;
        },

        /** @private */
        processGroup: function(group, scale) {
            // Align the first row
            this.align(group.items[0], scale);

            var items = this.cleanGroup(group);
            var i, j, d, w, col, cols;
            var size = _.max(_.map(items, function(row) {
                return row.length;
            }));

            for(i=0; i < size; i++) {
                cols = this.getCols(items, i);
                var colDist = {};
                var colWidth = {};

                var distance = 0;
                var width = 0;

                // First determine the biggest offset
                for(j=0; j < cols.length; j++) {
                    col = cols[j];

                    if(typeof col === 'undefined') {
                        continue;
                    }

                    d = Euterpe.getDistance(col.parent, col, scale)
                        + col.leftMargin * scale;

                    colDist[col.id] = d;

                    if(d > distance) {
                        distance = d;
                    }

                    w = col.getRealWidth(scale, true);

                    colWidth[col.id] = w;

                    if(w > width) {
                        width = w;
                    }
                }

                // Next add the difference to all required columns
                for(j=0; j < cols.length; j++) {
                    col = cols[j];

                    if(typeof col === 'undefined') {
                        continue;
                    }

                    d = colDist[col.id];
                    w = colWidth[col.id];

                    if(d < distance) {
                        col.leftMargin += (distance - d) / scale;
                    }

                    if(w < width) {
                        col.rightMargin += (width - w) / scale;
                    }
                }
            }
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
