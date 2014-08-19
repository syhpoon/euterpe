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
     * @param {Number} [config.numberOfLine=5] - Number of visible lines
     */
    function Measure(config) {
        Measure.super.call(this, "Euterpe.Measure", config);

        this.leftBarType = Euterpe.getConfig(config, "leftBarType", "single");
        this.rightBarType = Euterpe.getConfig(config, "rightBarType", "single");
        this.number = Euterpe.getConfig(config, "number", undefined);
        this.numberOfLines = Euterpe.getConfig(config, "numberOfLines", 5);
        this.prepared = [];

        this.leftBarWidth = this.widths[this.leftBarType];
        this.rightBarWidth = this.widths[this.rightBarType];
    }

    Euterpe.extend(Euterpe.Container, Measure, {
        realHeight: [0, 57.3],

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

        render: function(x, y, scale) {
            var lines = [];
            this.prepared = [this.renderSelf(x, y, scale)];

            x += this.leftBarWidth * scale;

            this.prepared.push(this.baseRender(x, y, scale));

            this.prepareLedgerLines(
                lines,
                Euterpe.select("Euterpe.Note", this),
                y, scale);

            this.renderLedgerLines(lines, scale, this.prepared[0]);

            return this.prepared;
        },

        prepareLedgerLines: function(lines, notes, y, scale) {
            for(var i=0; i < notes.length; i++) {
                var note = notes[i];

                if(typeof note.config.location === 'number') {
                    var width = note.getRealWidth(scale, true);
                    var d;

                    // Line below
                    if(note.config.location > (this.numberOfLines - 1)) {
                        d = Math.floor(note.config.location);

                        this.addLedgerLine(note, d, note.X, width, y, lines);
                    }
                    // Line above
                    else if(note.config.location < 0) {
                        d = Math.ceil(note.config.location);

                        this.addLedgerLine(note, d, note.X, width, y, lines);
                    }
                }
            }
        },

        /** @private **/
        addLedgerLine: function(item, pos, x, width, baseY, lines) {
            var found;

            while(true) {
                if((pos > 0 && pos <= 4) || (pos === 0)) {
                    break;
                }

                found = false;

                var _y = Euterpe.getY(pos, scale, baseY);

                if(item.name === 'Euterpe.Note') {
                    // Check if this line is already defined
                    for(var i=0; i < lines.length; i++) {
                        var line = lines[i];

                        if(line[0] === x && line[1] === _y) {
                            found = true;
                            break;
                        }
                    }

                    if(!found) {
                        lines.push([x, _y, width]);
                    }
                }

                pos += (pos > 0 ? -1: 1);
            }
        },

        /** @private */
        renderLedgerLines: function(lines, scale, prepared) {
            for(var i=0; i < lines.length; i++) {
                var x = lines[i][0];
                var y = lines[i][1];
                var shift = 5 * scale;
                var width = lines[i][2] + shift * 2;

                prepared.add(new Kinetic.Line({
                    points: [0, 0, width, 0],
                    stroke: 'black',
                    strokeWidth: Euterpe.global.lineWidth,
                    x: x - shift,
                    y: y
                }));
            }
        },

        /** @private */
        renderSelf: function(x, y, scale) {
            this.scale = scale;
            this.measureLength = this.getRealWidth(scale);

            this.line1_y = Euterpe.getY(0, scale, y);

            var barY = this.line1_y - (Euterpe.global.lineWidth / 2);

            var lb = this.initBar(this.leftBarType, x, barY, true);
            var startX = lb.startX;
            var rb = this.initBar(this.rightBarType,
                startX + this.measureLength, barY, false);

            this.leftBar = lb.bar;
            this.rightBar = rb.bar;

            this.line1 = new Kinetic.Line({
                points: [0, 0, this.measureLength, 0],
                stroke: 'black',
                strokeWidth: Euterpe.global.lineWidth,
                x: startX,
                y: this.line1_y
            });

            var prepared = new Kinetic.Group({});

            prepared.add(this.leftBar);
            prepared.add(this.line1);

            for(var i=2; i < this.numberOfLines + 1; i++) {
                var idx = "line_" + i;
                var idx_y = idx + "_y";

                this[idx_y] = Euterpe.getY(i - 1, scale, y);

                this[idx] = this.line1.clone({
                    y: this[idx_y]
                });

                prepared.add(this[idx]);
            }
            
            prepared.add(this.rightBar);

            if(typeof this.number !== 'undefined') {
                var number = new Kinetic.Text({
                    x: startX + 3 * scale,
                    y: this.line1_y - 13 * scale,
                    text: this.number.toString(),
                    fontSize: 10 * scale,
                    fontFamily: 'Arial',
                    fill: 'black'
                });

                prepared.add(number);
            }

            prepared.layer2draw = "background";

            return prepared;
        },

        initBar: function(type, x, y, isLeft) {
            var bar = new Kinetic.Group({});
            var barWidth = 2 * this.scale;
            var startX = x;
            var dotDiameter = 3 * this.scale;
            var m = isLeft ? 1: -1;

            var linePadding = Euterpe.global.linePadding;
            var lineWidth = Euterpe.global.lineWidth;

            var barHeight = linePadding * (this.numberOfLines - 1) +
                lineWidth * this.numberOfLines - (lineWidth / 2) + (lineWidth / 2);

            var offset = this.numberOfLines * this.scale;

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
