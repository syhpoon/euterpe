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
     * Time signature object
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {float} [config.x=0] - X coordinate of the note head
     * @param {float} [config.y=0] - Y coordinate of the note head
     * @param {float} [config.scale=1.0] - Scale factor
     * @param {String} [config.numerator="4"] - Numerator digit
     * @param {String} [config.denominator="4"] - Denominator digit
     *
     * Public attributes:
     *  group {Kinetic.Group()}
     */

    function Note(config) {
        this.init(config);
    }

    Note.prototype = {
        init: function(cfg) {
            this.scale = Euterpe.get_config(cfg, "scale", 1.0);
            this.startX = Euterpe.get_config(cfg, "x", 0);
            this.startY = Euterpe.get_config(cfg, "y", 0);
            this.numerator = Euterpe.get_config(cfg, "numerator", "4");
            this.denominator = Euterpe.get_config(cfg, "denominator", "4");

            this.group = new Kinetic.Group();

            this.group.add(this.getNum(this.numerator));
            //this.group.add(this.getDenom(this.denominator));
        },

        /**
         * Get numerator object
         *
         * @private
         * @param digit
         */
        getNum: function(digit) {
            var self = this;

            if(digit === "4") {
                return new Kinetic.Shape({
                    sceneFunc: function(ctx) {
                        ctx.beginPath();
                        ctx.moveTo(self.startX, self.startY);

                        ctx.lineTo(self.startX - 10 * self.scale, self.startY);
                        ctx.bezierCurveTo(46.8 * self.scale, 16.4 * self.scale,
                                          45.06 * self.scale, 20.26 * self.scale,
                                          38 * self.scale, 25.6 * self.scale);
                        ctx.lineTo(38 * self.scale, 26.6 * self.scale);
                        ctx.lineTo(52 * self.scale, 26.6 * self.scale);
                        ctx.lineTo(52 * self.scale, 32 * self.scale);
                        ctx.lineTo(50 * self.scale, 32 * self.scale);
                        ctx.lineTo(50 * self.scale, 33 * self.scale);
                        ctx.lineTo(60 * self.scale, 33 * self.scale);
                        ctx.lineTo(60 * self.scale, 32 * self.scale);
                        ctx.lineTo(58 * self.scale, 32 * self.scale);
                        ctx.lineTo(58 * self.scale, 26.6 * self.scale);
                        ctx.lineTo(60 * self.scale, 26.6 * self.scale);
                        ctx.lineTo(60 * self.scale, 25.6 * self.scale);
                        ctx.lineTo(58 * self.scale, 25.6 * self.scale);
                        ctx.lineTo(58 * self.scale, 11 * self.scale);
                        ctx.lineTo(52 * self.scale, 16.8 * self.scale);
                        ctx.lineTo(52 * self.scale, 25.6 * self.scale);
                        ctx.lineTo(39 * self.scale, 25.6 * self.scale);
                        ctx.lineTo(self.startX, self.startY);

                        ctx.fillStrokeShape(this);
                    },
                    fill: 'black',
                    stroke: 'black',
                    strokeWidth: 0
                });
            }
        }
    };

    return Note;
}());
