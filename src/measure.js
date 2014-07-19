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
        Measure.super.call(this, "Euterpe.Measure", config);

        this.leftBarType = Euterpe.getConfig(config, "leftBarType", "single");
        this.rightBarType = Euterpe.getConfig(config, "rightBarType", "single");
        this.number = Euterpe.getConfig(config, "number", undefined);
        this.ledgerLines = [];
        this.prepared = [];

        this.leftBarWidth = this.widths[this.leftBarType];
        this.rightBarWidth = this.widths[this.rightBarType];
    }

    Euterpe.extend(Euterpe.Container, Measure, {
        widths: {
            "none": 0,
            "single": 2.5,
            "double": 7.5,
            "double bold": 13.75,
            "repeat": 20.5
        },

        // Override width calculation
        getRealWidth: function(scale, excludeMargins) {
            var width = Euterpe.Container.prototype.getRealWidth.call(
                this, scale, excludeMargins);

            return width + this.leftBarWidth * scale + this.rightBarWidth * scale;
        },

        /**
         * Calculate item y coordinate
         *
         * @public
         * @param {Object} item
         * @param {Object} location - Location definition
         * @param {Number} x
         * @param {Number} y
         * @param {Number} scale
         * @returns {Number}
         */
        getItemY: function(item, location, x, y, scale) {
            if(typeof location === 'undefined') {
                return y;
            }

            if(typeof location.line === 'number') {
                return this.getItemYLine(item, location, x, y);
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
         * @param {Object} item
         * @param {Object} location
         * @param {Number} x
         * @param {Number} y
         * @returns {Number}
         */
        getItemYLine: function(item, location, x, y) {
            var offset = this.linePadding / 2 + this.lineWidth / 2;

            switch(location.line) {
                case 1:
                    return this.line1.y();
                case 1.5:
                    return this.line1.y() + offset;
                case 2:
                    return this.line2.y();
                case 2.5:
                    return this.line2.y() + offset;
                case 3:
                    return this.line3.y();
                case 3.5:
                    return this.line3.y() + offset;
                case 4:
                    return this.line4.y();
                case 4.5:
                    return this.line4.y() + offset;
                case 5:
                    return this.line5.y();
                // Ledger lines
                default:
                    var width = item.getRealWidth(scale, true);
                    var d, extra;

                    // Line below
                    if(location.line > 5) {
                        d = Math.floor(location.line) - 5;
                        extra = Math.ceil(location.line) > location.line ? offset: 0;

                        return this.addLedgerLine(item, d, x, width,
                                                  this.line5.y(), 1) + extra;
                    }
                    // Line above
                    else if(location.line < 0) {
                        d = Math.ceil(location.line);
                        extra = Math.floor(location.line) < location.line ? offset: 0;

                        return this.addLedgerLine(item, d * -1, x, width,
                                                  this.line1.y(), -1) - extra;
                    }
            }

            return y;
        },

        /** @private **/
        addLedgerLine: function(item, pos, x, width, baseY, m) {
            if(pos === 0) {
                return baseY;
            }

            var off = this.linePadding * pos + (this.lineWidth * pos);
            var _y = baseY + off * m;

            if(item.name === 'Euterpe.Note') {
                // Check if this line is already defined
                if(!_.find(this.ledgerLines, function(line) {
                    return line[0] === x && line[1] === _y;
                })) {
                    this.ledgerLines.push([x, _y, width]);
                }
            }

            this.addLedgerLine(item, pos - 1, x, width, baseY, m);

            return _y;
        },

        render: function(x, y, scale) {
            this.prepared = [this.renderSelf(x, y, scale)];

            x += this.leftBarWidth * scale;

            var self = this;

            var itemcb = function(item, x, y, scale) {
                var _y = Euterpe.getItemY(self, item, x, y, scale);

                item.Y = _y;

                return item.render(x, _y, scale);
            };

            var contcb = function(item, x, y, scale) {
                return item.render(x, y, scale);
            };

            this.prepared.push(this.baseRender(x, y, scale, itemcb, contcb));

            this.prepareLedgerLines(this.ledgerLines, scale);

            return this.prepared;
        },

        /** @private */
        prepareLedgerLines: function(lines, scale) {
            for(var i=0; i < lines.length; i++) {
                var x = lines[i][0];
                var y = lines[i][1];
                var shift = 5 * scale;
                var width = lines[i][2] + shift * 2;

                this.prepared.push(new Kinetic.Line({
                    points: [0, 0, width, 0],
                    stroke: 'black',
                    strokeWidth: this.lineWidth,
                    x: x - shift,
                    y: y
                }));
            }
        },

        /** @private */
        renderSelf: function(x, y, scale) {
            this._x = x;
            this._y = y;
            this.scale = scale;
            this.measureLength = this.getRealWidth(scale);

            this.linePadding = 13 * this.scale;
            this.lineWidth = this.scale;

            var startY = this._y + (this.lineWidth / 2);

            this.line2_y = startY + this.linePadding * 1 + (this.lineWidth * 1);
            this.line3_y = startY + this.linePadding * 2 + (this.lineWidth * 2);
            this.line4_y = startY + this.linePadding * 3 + (this.lineWidth * 3);
            this.line5_y = startY + this.linePadding * 4 + (this.lineWidth * 4);

            var lb = this.initBar(this.leftBarType, this._x, this._y, true);
            var startX = lb.startX;
            var rb = this.initBar(this.rightBarType,
                                  startX + this.measureLength, this._y, false);

            this.leftBar = lb.bar;
            this.rightBar = rb.bar;

            this.line1 = new Kinetic.Line({
                points: [0, 0, this.measureLength, 0],
                stroke: 'black',
                strokeWidth: this.lineWidth,
                x: startX,
                y: startY
            });

            this.line2 = this.line1.clone({
                y: this.line2_y
            });
            
            this.line3 = this.line1.clone({
                y: this.line3_y
            });

            this.line4 = this.line1.clone({
                y: this.line4_y
            });
            
            this.line5 = this.line1.clone({
                y: this.line5_y
            });

            this.prepared = new Kinetic.Group({});

            this.prepared.add(this.leftBar);
            this.prepared.add(this.line1);
            this.prepared.add(this.line2);
            this.prepared.add(this.line3);
            this.prepared.add(this.line4);
            this.prepared.add(this.line5);
            this.prepared.add(this.rightBar);

            if(typeof this.number !== 'undefined') {
                var number = new Kinetic.Text({
                    x: startX + 3 * scale,
                    y: startY - 13 * scale,
                    text: this.number.toString(),
                    fontSize: 10 * scale,
                    fontFamily: 'Arial',
                    fill: 'black'
                });

                this.prepared.add(number);
            }

            return this.prepared;
        },

        initBar: function(type, x, y, isLeft) {
            var bar = new Kinetic.Group({});
            var barWidth = 2 * this.scale;
            var startX = x;
            var dotDiameter = 3 * this.scale;
            var m = isLeft ? 1: -1;

            var barHeight = this.linePadding * 4 +
                this.lineWidth * 5 - (this.lineWidth / 2) + (this.lineWidth / 2);

            var offset = 5 * this.scale;

            if(type === "single") {
                startX = x + (barWidth / 2);

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
                startX = x + (barWidth / 2);

                var b1 = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });

                var b2 = b1.clone({
                    x: startX + offset * m
                });

                bar.add(b1);
                bar.add(b2);
            }
            else if(type === "double bold" || type === "repeat") {
                var bigWidth = 4 * this.scale;

                startX = x + (barWidth + bigWidth) / 2;

                var db1 = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth + bigWidth,
                    x: startX,
                    y: y
                });

                var db2 = db1.clone({
                    x: startX + bigWidth * m + offset * m,
                    strokeWidth: barWidth
                });

                bar.add(db1);
                bar.add(db2);

                if(type === "repeat") {
                    var dot = new Kinetic.Circle({
                        x: startX + bigWidth * m + offset * m + offset * m,
                        y: this.line2_y + 7 * scale,
                        radius: dotDiameter,
                        fill: 'black',
                        strokeWidth: 0
                    });

                    bar.add(dot);
                    bar.add(dot.clone({
                        y: this.line3_y + 7 * scale
                    }));
                }
            }

            return {bar: bar, startX: startX};
        }
    });

    return Measure;
}());
