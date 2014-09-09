/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginAlignMultiline = (function() {
    /**
     * PluginAlignMultiline [plugin]
     * Vertically align Multiline items
     * Adds attributes "column" :: number() to Multiline items
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginAlignMultiline = function(config) {
        PluginAlignMultiline.super.call(this,
            "Euterpe.PluginAlignMultiline", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginAlignMultiline, {
        process: function(root, scale) {
            var multilines = Euterpe.select("Euterpe.Multiline", root);

            for(var i=0; i < multilines.length; i++) {
                this.processMultiline(multilines[i], scale);
            }

            return root;
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

    return PluginAlignMultiline;
}());
