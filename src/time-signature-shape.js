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
        this.digit = digit.toString();
        this.realWidth = 22.4;
        this.location = location;

        TimeSignatureShape.super.call(this, "Euterpe.TimeSignatureShape");
    }

    Euterpe.extend(Euterpe.Node, TimeSignatureShape, {
        render: function(startX, startY, scale) {
            var self = this;
            this.scale = scale;
            this.startX = startX;
            this.startY = startY;

            if(this.digit === "4") {
                this.prepared = new Kinetic.Shape({
                    sceneFunc: function(ctx) {
                        var x = self.startX + 17.6 * scale;
                        var y = self.startY;

                        ctx.beginPath();
                        ctx.moveTo(x, y);

                        ctx.lineTo(x - 10 * self.scale, y);
                        ctx.bezierCurveTo(
                            x - 8.8 * self.scale, y + 6.8 * self.scale,
                            x - 10.54 * self.scale, y + 10.66 * self.scale,
                            x - 17.6 * self.scale, y + 16 * self.scale);

                        ctx.lineTo(x - 17.6 * self.scale, y + 17 * self.scale);
                        ctx.lineTo(x - 3.6 * self.scale, y + 17 * self.scale);
                        ctx.lineTo(x - 3.6 * self.scale, y + 22.4 * self.scale);
                        ctx.lineTo(x - 5.6 * self.scale, y + 22.4 * self.scale);
                        ctx.lineTo(x - 5.6 * self.scale, y + 23.4 * self.scale);
                        ctx.lineTo(x - 5.6 * self.scale, y + 23.4 * self.scale);
                        ctx.lineTo(x + 4.4 * self.scale, y + 23.4 * self.scale);
                        ctx.lineTo(x + 4.4 * self.scale, y + 22.4 * self.scale);
                        ctx.lineTo(x + 2.4 * self.scale, y + 22.4 * self.scale);
                        ctx.lineTo(x + 2.4 * self.scale, y + 17 * self.scale);
                        ctx.lineTo(x + 4.4 * self.scale, y + 17 * self.scale);
                        ctx.lineTo(x + 4.4 * self.scale, y + 16 * self.scale);
                        ctx.lineTo(x + 2.4 * self.scale, y + 16 * self.scale);
                        ctx.lineTo(x + 2.4 * self.scale, y + 1.4 * self.scale);
                        ctx.lineTo(x - 3.6 * self.scale, y + 7.2 * self.scale);
                        ctx.lineTo(x - 3.6 * self.scale, y + 16 * self.scale);
                        ctx.lineTo(x - 16.6 * self.scale, y + 16 * self.scale);

                        ctx.lineTo(x, y);

                        ctx.fillStrokeShape(this);
                    },
                    fill: 'black',
                    stroke: 'black',
                    strokeWidth: 0
                });
            }

            return this.prepared;
        }
    });

    return TimeSignatureShape;
})();

