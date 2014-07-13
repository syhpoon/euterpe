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
    }

    Euterpe.extend(Euterpe.Container, Measure, {
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
    });

    return Measure;
}());
