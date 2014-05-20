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
     * @param {Number} config.measureLength - Length of the measure
     * @param {Number} [config.x=0] - X coordinate of the upper left corner
     * @param {Number} [config.y=0] - Y coordinate of the upper left corner
     * @param {Number} [config.scale=1.0] - Scale factor
     * @param {String} [config.leftBarType=single] - Left bar type (single|double|double bold|repeat)
     * @param {String} [config.rightBarType=single] - Right bar type (single|double|double bold|repeat)
     *
     * Public attributes:
     *  leftBar {Kinetic.Line()} - Left bar
     *  rightBar {Kinetic.Line()} - Left bar
     *  leftBarWidth {Number} - Left bar width
     *  rightBarWidth {Number} - Right bar width
     *  line1 {Kinetic.Line()} - Line 1 (upper)
     *  line2 {Kinetic.Line()} - Line 2
     *  line3 {Kinetic.Line()} - Line 3
     *  line4 {Kinetic.Line()} - Line 4
     *  line5 {Kinetic.Line()} - Line 5 (lower)
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
            this.leftBarType = Euterpe.get_config(cfg, "leftBarType", "single");
            this.rightBarType = Euterpe.get_config(cfg, "rightBarType", "single");
            this.measureLength = Euterpe.get_config(cfg, "measureLength", 0) * this.scale;

            this.linePadding = 13 * this.scale;
            this.lineWidth = 1 * this.scale;

            var lb = this.initLeftBar(this.leftBarType, this._x, this._y);
            var rb = this.initRightBar(this.rightBarType,
                                       lb.x + this.measureLength, this._y);

            this.leftBar = lb.bar;
            this.leftBarWidth = lb.barWidth;
            this.rightBar = rb.bar;
            this.rightBarWidth = rb.barWidth;

            var startX = lb.x;
            var startY = this._y + (this.lineWidth / 2);

            var line2_y = startY + this.linePadding * 1 +
                (this.lineWidth * 1);
            var line3_y = startY + this.linePadding * 2 +
                (this.lineWidth * 2);
            var line4_y = startY + this.linePadding * 3 +
                (this.lineWidth * 3);
            var line5_y = startY + this.linePadding * 4 +
                (this.lineWidth * 4);

            this.line1 = new Kinetic.Line({
                points: [0, 0, this.measureLength, 0],
                stroke: 'black',
                strokeWidth: this.lineWidth,
                x: startX,
                y: startY
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
            this.group.add(this.rightBar);

            return this.group;
        },

        /**
         * Init left bar
         *
         * @private
         * @param {String} type - Bar type
         * @param {Number} x
         * @param {Number} y
         * @returns {Object}
         */
        initLeftBar: function(type, x, y) {
            var bar = new Kinetic.Group({});
            var barWidth = 2 * this.scale;
            var startX = x + (barWidth / 2);

            var barHeight = this.linePadding * 4 +
                this.lineWidth * 5 - (this.lineWidth / 2) + (this.lineWidth / 2);

            var offset = 5 * this.scale;

            if(type === "single") {
                var b = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });

                bar.add(b);
            }
            else if(type === "double") {
                var b1 = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });

                var b2 = b1.clone({
                    x: startX + offset
                });

                bar.add(b1);
                bar.add(b2);

                barWidth = barWidth * 2 + offset;
            }
            else if(type === "double bold") {
                var leftWidth = 4 * this.scale;

                var db1 = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth + leftWidth,
                    x: startX,
                    y: y
                });

                var db2 = db1.clone({
                    x: startX + leftWidth + offset,
                    strokeWidth: barWidth
                });

                bar.add(db1);
                bar.add(db2);

                barWidth = barWidth * 2 + leftWidth + offset;
            }

            return {bar: bar, x: startX, barWidth: barWidth};
        },

        /**
         * Init right bar
         *
         * @private
         * @param {String} type - Bar type
         * @param {Number} x
         * @param {Number} y
         * @returns {Object}
         */
        initRightBar: function(type, x, y) {
            var bar = new Kinetic.Group({});
            var barWidth = 2 * this.scale;
            var startX = x - (barWidth / 2);

            var barHeight = this.linePadding * 4 +
                this.lineWidth * 5 - (this.lineWidth / 2) + (this.lineWidth / 2);

            var offset = 5 * this.scale;

            if(type === "single") {
                var b = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });

                bar.add(b);
            }
            else if(type === "double") {
                var b1 = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });

                var b2 = b1.clone({
                    x: startX - offset
                });

                bar.add(b1);
                bar.add(b2);

                barWidth = barWidth * 2 + offset;
            }
            else if(type === "double bold") {
                var rightWidth = 4 * this.scale;

                var db1 = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth + rightWidth,
                    x: startX,
                    y: y
                });

                var db2 = db1.clone({
                    x: startX - rightWidth - offset,
                    strokeWidth: barWidth
                });

                bar.add(db1);
                bar.add(db2);

                barWidth = barWidth * 2 + rightWidth + offset;
            }

            return {bar: bar, barWidth: barWidth};
        }
    };

    return Measure;
}());
