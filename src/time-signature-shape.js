/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.TimeSignatureShape = (function() {
    /**
     * Digit prepared
     *
     * @param {Number} digit
     * @param {Object} location
     * @constructor
     */
    function TimeSignatureShape(digit, location) {
        this.yoffset = 2;
        var heights = {
            2: [0, 24 + this.yoffset],
            4: [0, 24 + this.yoffset]
        };

        this.digit = digit.toString();
        this.realWidth = 22.4;
        this.realHeight = heights[digit];

        TimeSignatureShape.super.call(this, "Euterpe.TimeSignatureShape",
                                      {location: location});
    }

    Euterpe.extend(Euterpe.Node, TimeSignatureShape, {

        render: function(x, y, scale) {
            var startY = y + this.yoffset * scale;
            var assets = [];

            if(this.digit === "2") {
                assets.push(this.shape2(x, startY, scale));
            }
            else if(this.digit === "4") {
                assets.push(this.shape4(x, startY, scale));
            }

            Euterpe.bind(this, assets);

            return assets;
        },

        /** @private */
        shape2: function(x, y, scale) {
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    var _x = x + scale;
                    var _y = y - 0.5 * scale;
                    var scY = scale * 0.20, scX = scY * 1.1;

                    ctx.translate(_x, _y);
                    ctx.scale(scX, scY);

                    ctx.beginPath();
                    ctx.moveTo(96.3, 78.7);
                    ctx.bezierCurveTo(96.3, 97.7, 91.7, 123.2, 67.1, 123.2);
                    ctx.bezierCurveTo(58.1, 123.2, 51.8, 118.6, 45.9, 114.1);
                    ctx.bezierCurveTo(40.2, 109.6, 34.6, 104.8, 26.6, 104.2);
                    ctx.bezierCurveTo(17.9, 103.6, 9.9, 110.1, 9.6, 118.9);
                    ctx.lineTo(0.9, 118.9);
                    ctx.bezierCurveTo(-5.4, 92.9, 23.5, 79.0, 41.1, 68.2);
                    ctx.bezierCurveTo(53.2, 60.6, 64.3, 47.8, 64.6, 32.6);
                    ctx.bezierCurveTo(64.8, 14.4, 56.1, 9.1, 43.3, 9.1);
                    ctx.bezierCurveTo(30.0, 9.1, 24.9, 12.2, 24.9, 16.7);
                    ctx.bezierCurveTo(24.9, 22.6, 40.5, 21.2, 40.5, 36.5);
                    ctx.bezierCurveTo(40.5, 45.9, 31.2, 53.5, 21.8, 53.5);
                    ctx.bezierCurveTo(11.6, 52.4, 3.1, 45.9, 3.1, 34.8);
                    ctx.bezierCurveTo(3.1, 16.7, 16.2, 0.0, 52.7, 0.0);
                    ctx.bezierCurveTo(80.4, 0.0, 94.0, 17.3, 94.0, 34.5);
                    ctx.bezierCurveTo(94.0, 66.8, 50.1, 67.9, 32.0, 84.4);
                    ctx.lineTo(32.0, 84.9);
                    ctx.bezierCurveTo(49.3, 82.1, 61.5, 86.4, 71.6, 92.3);
                    ctx.bezierCurveTo(77.0, 95.4, 87.8, 95.7, 87.8, 78.7);
                    ctx.lineTo(96.3, 78.7);
                    ctx.closePath();

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        },

        /** @private */
        shape4: function(x, y, scale) {
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    var _x = x + 17.6 * scale;
                    ctx.beginPath();
                    ctx.moveTo(_x, y);

                    ctx.lineTo(_x - 10 * scale, y);
                    ctx.bezierCurveTo(
                        _x - 8.8 * scale, y + 6.8 * scale,
                        _x - 10.54 * scale, y + 10.66 * scale,
                        _x - 17.6 * scale, y + 16 * scale);

                    ctx.lineTo(_x - 17.6 * scale, y + 17 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 17 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x - 5.6 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x - 5.6 * scale, y + 23.4 * scale);
                    ctx.lineTo(_x - 5.6 * scale, y + 23.4 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 23.4 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 17 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 17 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 16 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 16 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 1.4 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 7.2 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 16 * scale);
                    ctx.lineTo(_x - 16.6 * scale, y + 16 * scale);

                    ctx.lineTo(_x, y);

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        }
    });

    return TimeSignatureShape;
})();

