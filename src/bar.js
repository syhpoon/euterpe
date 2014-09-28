/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Bar = (function() {
    /**
     * Measure/Tab bar
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} [config.number] - Bar number
     */
    function Bar(config) {
        this.leftType = Euterpe.getConfig(config, "leftType", "none");
        this.rightType = Euterpe.getConfig(config, "rightType", "none");
        this.number = Euterpe.getConfig(config, "number", undefined);

        this.leftWidth = this.widths[this.leftType];
        this.rightWidth = this.widths[this.rightType];
        this.realWidth = this.leftWidth + this.rightWidth;
        this.realHeight = [16.3, 9];

        Bar.super.call(this, "Euterpe.Bar", config);
    }

    Euterpe.extend(Euterpe.Node, Bar, {
        widths: {
            "none": 0,
            "single": 2,
            "double": 7,
            "double bold": 13,
            "repeat": 24
        },

        render: function(x, y, scale) {
            var rendered = [];
            var top = Euterpe.getY(0, scale, y);
            var barY = top - (Euterpe.global.lineWidth / 2);

            if(this.rightWidth > 0) {
                rendered.push(this.initBar(this.rightType, x, barY, scale,false));
            }

            if(this.leftWidth > 0) {
                rendered.push(this.initBar(this.leftType,
                              x + this.rightWidth * scale, barY, scale, true));
            }

            return rendered;
        },

        /** @private */
        initBar: function(type, x, y, scale, isLeft) {
            var lines = this.parent.numberOfLines;
            var bar = new Kinetic.Group({});
            var barWidth = 2 * scale;
            var dotDiameter = 6 * scale;
            var offset = 5 * scale;
            var startX = x;
            var b1, b2;

            var linePadding = Euterpe.global.linePadding;
            var lineWidth = Euterpe.global.lineWidth;

            var barHeight = linePadding * (lines - 1) +
                     lineWidth * lines - (lineWidth / 2) + (lineWidth / 2);

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

                b1 = new Kinetic.Line({
                    points: [0, 0, 0, barHeight],
                    stroke: 'black',
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });

                b2 = b1.clone({
                    x: startX + offset
                });

                bar.add(b1);
                bar.add(b2);
            }
            else if(type === "double bold" || type === "repeat") {
                var x1, x2, x3, sw1, sw2, sw3;
                var bigWidth = barWidth * 3;

                var barf = function(sw, x) {
                    return new Kinetic.Line({
                        points: [0, 0, 0, barHeight],
                        stroke: 'black',
                        strokeWidth: sw,
                        x: x,
                        y: y
                    });
                };

                var circlef = function(x) {
                    var line2 = Euterpe.getY(1, scale, y);
                    var line3 = Euterpe.getY(2, scale, y);
                    var g = new Kinetic.Group();

                    var dot = new Kinetic.Circle({
                        x: x,
                        y: line2 + 7 * scale,
                        radius: dotDiameter / 2,
                        fill: 'black',
                        strokeWidth: 0
                    });

                    g.add(dot);
                    g.add(dot.clone({
                        y: line3 + 7 * scale
                    }));

                    return g;
                };

                var objs = [];

                if(isLeft) {
                    sw1 = bigWidth;
                    sw2 = barWidth;
                    sw3 = dotDiameter;

                    x1 = x + sw1 / 2;
                    x2 = x + sw1 + offset + sw2 / 2;
                    x3 = x + sw1 + offset + sw2 + offset + sw3 / 2;

                    objs.push(barf(sw1, x1));
                    objs.push(barf(sw2, x2));

                    if(type === "repeat") {
                        objs.push(circlef(x3));
                    }
                }
                else if(type == "repeat") {
                    sw1 = dotDiameter;
                    sw2 = barWidth;
                    sw3 = bigWidth;

                    x1 = x + sw1 / 2;
                    x2 = x + sw1 + offset + sw2 / 2;
                    x3 = x + sw1 + offset + sw2 + offset + sw3 / 2;

                    objs.push(circlef(x1));
                    objs.push(barf(sw2, x2));
                    objs.push(barf(sw3, x3));
                }
                else {
                    sw1 = barWidth;
                    sw2 = bigWidth;

                    x1 = x + sw1 / 2;
                    x2 = x + sw1 + offset + sw2 / 2;

                    objs.push(barf(sw1, x1));
                    objs.push(barf(sw2, x2));
                }

                _.each(objs, function(obj) { bar.add(obj);});
            }

            return bar;
        }
    });

    return Bar;
}());
