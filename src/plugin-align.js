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
            for(var i=0; i < root.items.length; i++) {
                var row = root.items[i];
                var j;

                // Step 1. Set margins for non-columns (nodes)
                var nodes = this.collectNodes(row);

                for(j=0; j < nodes.length; j++) {
                    nodes[j].leftMargin = this.nodeMargin;
                }

                // Step 2. Set margins for columns
                var rowWidth = row.getRealWidth(scale);
                var cols = Euterpe.select("Euterpe.Column", row);
                var diff = this.totalWidth - rowWidth;
                // +1 here is for rightMargin of the last column
                var margin = (diff / (cols.length + 1)) / scale;

                for(j=0; j < cols.length; j++) {
                    cols[j].leftMargin = margin;

                    if(j == cols.length - 1) {
                        cols[j].rightMargin = margin;
                    }
                }
            }

            return root;
        },

        /** @private */
        collectNodes: function(row) {
            return _.filter(row.items,
                function(item) {
                    return item.name !== 'Euterpe.Bar' &&
                           item.name !== 'Euterpe.Column';
                });
        },

        /** @private **/
        compareRoots: function(a, b) {
            var eq = 0;

            for(var i=0; i < a.length; i++) {
                if(i >= b.length) {
                    return false;
                }
                else if(a[i].id === b[i].id) {
                    eq += 1;
                }
            }

            return eq === b.length;
        },

        /** @private **/
        processMultiline: function(ml, scale) {
            var items = {};

            this.collectItems(ml, items, scale);

            var columns = _.map(_.keys(items),
                                function(x) {return parseInt(x)})
                               .sort(function(a,b) {return a - b;});

            var roots = null;

            for(var i=0; i < columns.length; i++) {
                var j;
                var c = columns[i];
                var col = items[c][1];
                var maxW = _.max(_.map(col, function(x) {return x[2];}));
                var offset = 0;
                var parent, item, width, distance;

                if(roots !== null && !this.compareRoots(roots, items[c][0])) {
                    this.alignObjects(roots);

                    roots = null
                }

                if(roots === null) {
                    roots = items[c][0];
                }

                // Get the column offset
                for(j=0; j < col.length; j++) {
                    parent = col[j][0];
                    item = col[j][1];

                    distance = Euterpe.getDistance(parent, item, 1) +
                        item.leftMargin;

                    if(distance > offset) {
                        offset = distance;
                    }
                }

                // Align column
                for(j=0; j < col.length; j++) {
                    parent = col[j][0];
                    item = col[j][1];
                    width = col[j][2];
                    var wDiff = maxW - width;

                    distance = Euterpe.getDistance(parent, item, 1)
                        + item.leftMargin;

                    if(distance < offset) {
                        item.leftMargin += (offset - distance);
                    }

                    // Need to compensate width difference
                    if(wDiff > 0) {
                        // Center align
                        item.leftMargin += wDiff / 2;
                        item.rightMargin += wDiff / 2;
                    }
                }
            }

            if(roots !== null) {
                this.alignObjects(roots);
            }
        },

        /** @private **/
        contains: function(list, obj) {
            for(var i=0; i < list.length; i++) {
                if(list[i].id === obj.id) {
                    return true;
                }
            }

            return false;
        },

        /** @private **/
        collectItems: function(root, acc, scale, top) {
            for(var i=0; i < root.items.length; i++) {
                var item = root.items[i];

                if(typeof item.config.column === 'number') {
                    var col = item.config.column;

                    if(typeof acc[col] === 'undefined') {
                        acc[col] = [[], []];
                    }

                    var p = Euterpe.getRootParent(item);

                    if(!this.contains(acc[col][0], p)) {
                        acc[col][0].push(p);
                    }

                    acc[col][1].push([top ? top: item,
                                      item, item.getRealWidth(1, true)]);
                }

                // We do not want to process any nested Multilines here
                // because they will be processed in the previous step
                if(item.isContainer && item.name !== 'Euterpe.Multiline') {
                    this.collectItems(item, acc, scale, top ? top: item);
                }
            }
        },

        /** @private **/
        alignObjects: function(objects) {
            var i;
            var widths = {};

            for(i=0; i < objects.length; i++) {
                widths[objects[i].id] = objects[i].getRealWidth(1);
            }

            var maxW = _.max(_.values(widths));

            for(i=0; i < objects.length; i++) {
                var obj = objects[i];
                var width = widths[obj.id];

                if(width < maxW) {
                    var last = obj.items[obj.items.length - 1];

                    if(typeof last !== 'undefined') {
                        last.rightMargin += (maxW - width);
                    }
                }
            }
        }

    });

    return PluginAlign;
}());
