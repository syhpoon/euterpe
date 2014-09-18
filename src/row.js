/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Row = (function() {
    /**
     * Row [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} config.type - Row type ('measure' | 'tab')
     */
    function Row(config) {
        Row.super.call(this, "Euterpe.Row", config);

        this.type = Euterpe.getConfig(config, "type");

        if(this.type === 'measure') {
            this.numberOfLines = 5;
        }
        else if(this.type === 'tab') {
            this.numberOfLines = 6;
        }

        this.prepared = [];
    }

    Euterpe.extend(Euterpe.Container, Row, {
        realHeight: [0, 57.3],

        render: function(x, y, scale) {
            var rendered = [];
            var totalWidth = 0;
            var origX = x;

            for(var i=0; i < this.items.length; i++) {
                var column = this.items[i];

                column.parent = this;

                column.X = x + column.leftMargin * scale;
                column.Y = y;

                rendered.push(column.render(column.X, column.Y, scale));

                var w = column.getRealWidth(scale);

                totalWidth += w;

                x += w;
            }

            rendered.push(this.renderSelf(origX, y, scale, totalWidth));

            return rendered;
        },

        /** @private */
        renderSelf: function(x, y, scale, width) {
            var line1 = new Kinetic.Line({
                points: [0, 0, width, 0],
                stroke: 'black',
                strokeWidth: Euterpe.global.lineWidth,
                x: x,
                y: y
            });

            var rendered = new Kinetic.Group({});

            rendered.add(line1);

            for(var i=2; i < this.numberOfLines + 1; i++) {
                var _y = Euterpe.getY(i - 1, scale, y);

                var line = line1.clone({
                    y: _y
                });

                rendered.add(line);
            }

            return rendered;
        }
    });

    return Row;
}());
