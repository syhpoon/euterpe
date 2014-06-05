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
     * Measure [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} config.number - Measure number
     * @param {String} [config.leftBarType=single] - Left bar type (none|single|double|double bold|repeat)
     * @param {String} [config.rightBarType=single] - Right bar type (none|single|double|double bold|repeat)
     */
    function Measure(config) {
        Euterpe.initContainer(this, "Euterpe.Measure", config);

        this.leftBarType = Euterpe.getConfig(config, "leftBarType", "single");
        this.rightBarType = Euterpe.getConfig(config, "rightBarType", "single");
        this.number = Euterpe.getConfig(config, "number", undefined);
    }

    Measure.prototype = {
        /**
         * Calculate item y coordinate
         *
         * @public
         * @param {Object} item
         * @param {Object} location - Location definition
         * @param {Number} y
         * @param {Number} scale
         * @returns {Number}
         */
        getItemY: function(item, location, y, scale) {

            if(typeof location === 'undefined') {
                return y;
            }

            if(typeof location.line === 'number') {
                return this.getItemYLine(location, y);
            }

            if(typeof location.raw === 'function') {
                return location.raw(this, item, y, scale);
            }

            return y;
        },

        /**
         * Calculate item y coordinate base on specified line number
         *
         * @private
         * @param {Object} location
         * @param {Number} y
         * @returns {Number}
         */
        getItemYLine: function(location, y) {
            var offset = this.linePadding / 2 + this.lineWidth / 2;

            switch(location.line) {
                case 1:
                    return this.line1.y();
                    break;
                case 1.5:
                    return this.line1.y() + offset;
                    break;
                case 2:
                    return this.line2.y();
                    break;
                case 2.5:
                    return this.line2.y() + offset;
                    break;
                case 3:
                    return this.line3.y();
                    break;
                case 3.5:
                    return this.line3.y() + offset;
                    break;
                case 4:
                    return this.line4.y();
                    break;
                case 4.5:
                    return this.line4.y() + offset;
                    break;
                case 5:
                    return this.line5.y();
                    break;
            }

            return y;
        },

        prepare: function(x, y, scale) {
            var self = this;
            var acc = [this.prepareSelf(x, y, scale)];

            var itemcb = function(item, x, y, scale) {
                var itemY = Euterpe.getItemY(self, item, y, scale);

                if(typeof item.prepareMeasure === 'function') {
                    return item.prepareMeasure(x, itemY, scale);
                }
                else {
                    return item.prepare(x, itemY, scale);
                }
            };

            var contcb = function(item, x, y, scale) {
                if(typeof item.prepareMeasure === 'function') {
                    return item.prepareMeasure(x, y, scale);
                }
                else {
                    return item.prepare(x, y, scale);
                }
            };

            return acc.concat(this.basePrepare(x, y, scale, itemcb, contcb));
        },

        /**
         * @private
         */
        prepareSelf: function(x, y, scale) {
            this._x = x;
            this._y = y;
            this.scale = scale;
            this.measureLength = Euterpe.getRealWidth(this);

            this.linePadding = 13 * this.scale;
            this.lineWidth = this.scale;

            var lb = this.initLeftBar(this.leftBarType, this._x, this._y);
            var rb = this.initRightBar(this.rightBarType,
                                       lb.x + this.measureLength, this._y);

            this.leftBar = lb.bar;
            this.leftBarWidth = lb.barWidth;
            this.rightBar = rb.bar;
            this.rightBarWidth = rb.barWidth;

            var startX = lb.x;
            var startY = this._y + (this.lineWidth / 2);

            var line2_y = startY + this.linePadding * 1 + (this.lineWidth * 1);
            var line3_y = startY + this.linePadding * 2 + (this.lineWidth * 2);
            var line4_y = startY + this.linePadding * 3 + (this.lineWidth * 3);
            var line5_y = startY + this.linePadding * 4 + (this.lineWidth * 4);

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

            if(typeof this.number !== 'undefined') {
                var number = new Kinetic.Text({
                    x: startX + 3 * scale,
                    y: startY - 13 * scale,
                    text: this.number.toString(),
                    fontSize: 10 * scale,
                    fontFamily: 'Arial',
                    fill: 'black'
                });

                this.group.add(number);
            }

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

            if(type === "none") {
                barWidth = 0;
            }
            else if(type === "single") {
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
            var bar = new Kinetic.Group();
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
