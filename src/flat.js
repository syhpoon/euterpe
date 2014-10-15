/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Flat = (function() {
    /**
     * Flat accidental
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    function Flat(config) {
        this.realWidth = 12.25;
        this.realHeight = [16.3, 9];

        Flat.super.call(this, "Euterpe.Flat", config);
    }

    Euterpe.extend(Euterpe.Node, Flat, {
        render: function(x, y, scale) {
            var height = (this.realHeight[0] + this.realHeight[1]) * scale;
            this.barWidth = 1.5 * scale;

            y -= 16.25 * scale;

            var bar = new Kinetic.Line({
                points: [0, 0, 0, height],
                stroke: 'black',
                strokeWidth: this.barWidth,
                x: x,
                y: y
            });

            var _y = y + height;
            var _x = x + this.barWidth / 2;

            var curve1 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();

                    ctx.moveTo(_x, _y);
                    ctx.lineTo(_x + 7 * scale, _y - 5.25 * scale);
                    ctx.bezierCurveTo(_x + 12 * scale, _y - 8.75 * scale,
                        _x + 12.5 * scale, _y - 19.75 * scale,
                        _x, _y - 13.75 * scale);

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });

            var curve2 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();

                    ctx.moveTo(_x, _y - 1.25 * scale);
                    ctx.bezierCurveTo(_x + 9.75 * scale, _y - 6.75 * scale,
                        _x + 8.25 * scale, _y - 17.25 * scale,
                        _x, _y - 12.75 * scale);

                    ctx.fillStrokeShape(this);
                },
                fill: 'white',
                stroke: 'white',
                strokeWidth: 0
            });

            var rendered = [bar, curve1, curve2];

            Euterpe.bind(this, rendered);

            return rendered;
        }
    });

    return Flat;
}());
