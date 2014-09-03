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
                //this.alignObjects(multilines[i]);
            }

            return root;
        },

        /** @private **/
        processMultiline: function(ml, scale) {
            var items = {};

            this.collectItems(ml, items, scale);

            var columns = _.map(_.keys(items),
                                function(x) {return parseInt(x)})
                               .sort(function(a,b) {return a - b;});

            for(var i=0; i < columns.length; i++) {
                var j;
                var c = columns[i];
                var col = items[c];
                var maxW = _.max(_.map(col, function(x) {return x[2];}));
                var offset = 0;
                var parent;
                var item;
                var width;
                var distance;

                // Get the column offset
                for(j=0; j < col.length; j++) {
                    parent = col[j][0];
                    item = col[j][1];

                    distance = Euterpe.getDistance(parent, item, 1) +
                        item.leftMargin;

                    console.log(c, item.name, distance);
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

                    // Need to compensate width difference
                    /*
                    if(wDiff > 0) {
                        // Center align
                        item.leftMargin += wDiff / 2;
                        item.rightMargin += wDiff / 2;
                    }
                    */

                    distance = Euterpe.getDistance(parent, item, 1)
                        + item.leftMargin;

                    if(distance < offset) {
                        item.leftMargin += (offset - distance);
                    }
                }
            }
        },

        /** @private **/
        collectItems: function(root, acc, scale, top) {
            for(var i=0; i < root.items.length; i++) {
                var item = root.items[i];

                if(typeof item.config.column === 'number') {
                    var col = item.config.column;

                    if(typeof acc[col] === 'undefined') {
                        acc[col] = [];
                    }

                    acc[col].push([top ? top: item, item,
                                   item.getRealWidth(1, true)]);

                }

                // We do not want to process any nested Multilines here
                // because they will be processed in the previous step
                if(item.isContainer && item.name !== 'Euterpe.Multiline') {
                    this.collectItems(item, acc, scale, top ? top: item);
                }
            }
        },

        /** @private **/
        alignObjects: function(ml) {
            var objects = [];
            var i, j;
            var names = ["Euterpe.Measure", "Euterpe.Tab"];

            // Collect all objects from lines
            for(i=0; i < ml.items.length; i++) {
                var item = ml.items[i];

                var m = [];

                if(item.name in names) {
                    m = [item];
                }
                else {
                    for(var z=0; z < names.length; z++) {
                        m = m.concat(Euterpe.select(names[z], item));
                    }
                }

                for(j=0; j < m.length; j++) {
                    if(! _.isArray(objects[j])) {
                        objects[j] = [];
                    }

                    objects[j].push([m[j], m[j].getRealWidth(1)]);
                }
            }

            for(i=0; i < objects.length; i++) {
                var ms = objects[i];
                var maxW = _.max(_.map(ms, function(mx) { return mx[1]; }));

                for(j=0; j < ms.length; j++) {
                    var obj = ms[j][0];
                    var width = ms[j][1];

                    if(width < maxW) {
                        var last = obj.items[obj.items.length - 1];

                        if(typeof last !== 'undefined') {
                            last.rightMargin += (maxW - width);
                        }
                    }
                }
            }
        }

    });

    return PluginAlignMultiline;
}());
