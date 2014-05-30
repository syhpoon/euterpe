/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.TimeSignature = (function() {
    /**
     * Digit shape
     *
     * @param {Number} digit
     * @constructor
     */
    function Shape(digit) {
        this.digit = digit.toString();
        this.realWidth = 22.4;
    }

    Shape.prototype = {
        prepare: function(startX, startY, scale) {
            var self = this;
            this.scale = scale;
            this.startX = startX;
            this.startY = startY;

            if(this.digit === "4") {
                return new Kinetic.Shape({
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
        }
    };

    /**
     * Time signature [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} [config.numerator=4] - Numerator digit
     * @param {Number} [config.denominator=4] - Denominator digit
     */

    function TimeSignature(config) {
        this.numerator = Euterpe.get_config(config, "numerator", 4);
        this.denominator = Euterpe.get_config(config, "denominator", 4);

        Euterpe.initContainer(this);

        this.items.push(new Shape(this.numerator));
        this.items.push(new Shape(this.denominator));
    }

    TimeSignature.prototype = {
        // Override width calculation
        calculateWidth: function(scale) {
            var width = _.max(_.map(this.items,
                function(item) {return Euterpe.getRealWidth(item)})) * scale;

            this.realWidth = width;

            return width;
        },

        prepare: function(x, y, scale) {
            var group = new Kinetic.Group();

            var yUp = this.parentContainer.line1.y() + 2 * scale;
            var yDown = this.parentContainer.line3.y() + 2 * scale;

            group.add(this.items[0].prepare(x, yUp, scale));
            group.add(this.items[1].prepare(x, yDown, scale));

            return group;
        }
    };

    return TimeSignature;
}());
