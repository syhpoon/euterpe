/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Measure = (function() {
    /**
     * Measure object
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {float} [config.x=0] - X coordinate of the upper left corner
     * @param {float} [config.y=0] - Y coordinate of the upper left corner
     * @param {float} [config.scale=1.0] - Scale factor
     * @param {String} [config.leftBarType=single] - Left bar type (single|double|doubleBold|repeat)
     *
     * Public attributes:
     *  leftBar {Kinetic.Line()} - Left bar
     *  rightBar {Kinetic.Line()} - Left bar
     *  line1 {Kinetic.Line()} - Line 1 (upper)
     *  line2 {Kinetic.Line()} - Line 2 (upper)
     *  line3 {Kinetic.Line()} - Line 3 (upper)
     *  line4 {Kinetic.Line()} - Line 4 (upper)
     *  line5 {Kinetic.Line()} - Line 5 (upper)
     *  group {Kinetic.Group()}
     */
    function Measure(config) {
        this.init(config);
    }

    Measure.prototype = {
        init: function(cfg) {
            this.scale = Euterpe.get_config(cfg, "scale", 1.0);
            this._x = Euterpe.get_config(cfg, "x", 0);
            this._y = Euterpe.get_config(cfg, "y", 0);

            this.linePadding = 13 * this.scale;
            this.lineWidth = 1 * this.scale;
            this.barWidth = 2 * this.scale;

            // Length of the line
            var lineLength = 150;

            var start_x = this._x + (this.barWidth / 2);
            var start_y = this._y + (this.lineWidth / 2);

            var line2_y = start_y + this.linePadding * 1 +
                (this.lineWidth * 1);
            var line3_y = start_y + this.linePadding * 2 +
                (this.lineWidth * 2);
            var line4_y = start_y + this.linePadding * 3 +
                (this.lineWidth * 3);
            var line5_y = start_y + this.linePadding * 4 +
                (this.lineWidth * 4);

            var bar_height = this.linePadding * 4 +
                             this.lineWidth * 5 -
                             (this.lineWidth / 2);

            this.leftBar = new Kinetic.Line({
                points: [0, 0, 0, bar_height],
                stroke: 'black',
                strokeWidth: this.barWidth,
                x: start_x,
                y: this._y
            });
    
            this.line1 = new Kinetic.Line({
                points: [0, 0, lineLength, 0],
                stroke: 'black',
                strokeWidth: this.lineWidth,
                x: start_x,
                y: start_y
            });

            this.line2 = this.line1.clone({
                y: line2_y
            });
            
            this.line3 = this.line1.clone({
                y: line3_y
            });

            this.line4 = this.line1.clone({
                y: line4_y
            });
            
            this.line5 = this.line1.clone({
                y: line5_y
            });

            this.group = new Kinetic.Group({});

            this.group.add(this.leftBar);
            this.group.add(this.line1);
            this.group.add(this.line2);
            this.group.add(this.line3);
            this.group.add(this.line4);
            this.group.add(this.line5);

            return this.group;
        }
    };

    return Measure;
}());
