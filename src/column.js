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

            var w = _.max(
                _.map(this.items,
                    function(item) {
                        return item.getRealWidth(scale, bare);
                    })
            );

            return w + (bare ? 0: margins);
        },

        render: function(x, y, scale) {
            var rendered = [];

            for(var i=0; i < this.items.length; i++) {
                var node = this.items[i];

                node.X = x + node.leftMargin * scale;
                node.Y = Euterpe.getY(node, scale, y);

                rendered.push(node.render(node.X, node.Y, scale));
            }

            return rendered;
        }
    });

    return Column;
}());
