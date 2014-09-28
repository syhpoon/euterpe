/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Column = (function() {
    /**
     * Column [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    function Column(config) {
        Column.super.call(this, "Euterpe.Column", config);
    }

    Euterpe.extend(Euterpe.Container, Column, {
        // Override width calculation
        getRealWidth: function(scale, bare) {
            var margins = Euterpe.getMargins(this, scale);
            var items = this.collectItems();

            var w = _.max(
                _.map(items,
                    function(item) {
                        var left = 0;
                        var right = 0;

                        if(item.isNode) {
                            left = item.getLeftWidth(scale);
                            right = item.getRightWidth(scale);
                        }

                        return item.getRealWidth(scale, bare) +
                            (bare ? 0 : (left + right));
                    })
            );

            return w + (bare ? 0: margins);
        },

        getRealHeight: function(scale, raw) {
            var items = this.collectItems();

            return Euterpe.getRealHeight(this, items, scale, raw);
        },

        /** @private */
        collectItems: function() {
            var items = this.items;

            if(_.isArray(this.config.aboveItems)) {
                items = this.config.aboveItems.concat(this.items);
            }

            if(_.isArray(this.config.belowItems)) {
                items = items.concat(this.config.belowItems);
            }

            return items;
        },

        render: function(x, y, scale) {
            var rendered = [];
            var node;
            var i;
            var maxw = 0;
            var items = this.collectItems();

            var w = this.renderSideItems(items, scale, rendered, x, y, true);

            x += w;

            for(i=0; i < items.length; i++) {
                node = items[i];

                node.X = x;
                node.Y = Euterpe.getY(node, scale, y);

                rendered.push(node.render(node.X, node.Y, scale));

                w = node.getRealWidth(scale);

                if(w > maxw) {
                    maxw = w;
                }
            }

            this.renderSideItems(this.items, scale, rendered,
                                 x + maxw, y, false);

            return rendered;
        },

        /** @private */
        renderSideItems: function(items, scale, rendered, x, y, isLeft) {
            var ws = [];
            var maxw = 0;
            var lw = 0;

            if(isLeft) {
                // Calculate max width
                for(i=0; i < items.length; i++) {
                    if(items[i].isNode) {
                        w = items[i].getLeftWidth(scale);

                        ws.push(w);

                        if(w > maxw) {
                            maxw = w;
                        }
                    }
                    else {
                        ws.push(0);
                    }
                }
            }

            for(var i=0; i < items.length; i++) {
                var node = items[i];
                var w = 0;
                var offset = 0;

                if(typeof ws[i] !== 'undefined' && ws[i] !== maxw) {
                    offset = maxw - ws[i];
                }

                var side = isLeft ? node.leftItems: node.rightItems;

                for(var l=0; l < side.length; l++) {
                    var obj = side[l];

                    if(typeof obj.config.location === 'undefined') {
                        obj.config.location = node.config.location;
                    }

                    obj.X = x + offset + w;
                    obj.Y = Euterpe.getY(obj, scale, y);

                    rendered.push(obj.render(obj.X, obj.Y, scale));

                    w += obj.getRealWidth(scale);
                }

                if(w > lw) {
                    lw = w;
                }
            }

            return lw;
        },

        /** @private */
        reduceWidth: function(list, scale) {
            return _.reduce(list,
                function(acc, x) {
                    return acc + x.getRealWidth(scale);
                }, 0);
        }

    });

    return Column;
}());
