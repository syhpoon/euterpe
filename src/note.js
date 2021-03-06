/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Note = (function() {
    /**
     * Note object
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {String} [config.type="quarter"] - Note head type (whole|half|quarter)
     * @param {String} [config.beamDirection] - Beam direction (up|down)
     * @param {Number} [config.flags=0] - Number of flags
     * @param {Number} [config.dots=0|1|2|3] - Number of dots
     */

    function Note(config) {
        /** @public */
        this.type = Euterpe.getConfig(config, "type", "quarter");

        /** @public */
        this.beamDir = Euterpe.getConfig(config, "beamDirection", undefined);

        /** @public */
        this.flags = Euterpe.getConfig(config, "flags", 0);

        /** @public */
        this.dots = Euterpe.getConfig(config, "dots", 0);

        /** @public */
        this.beam = undefined;

        Note.super.call(this, "Euterpe.Note", config);

        this.headHeight = 13.3;
        this.realHeight = [this.headHeight / 2, this.headHeight / 2];

        if(this.type === "whole") {
            this.realWidth = this.headWidth = 21.2;
        }
        else {
            this.realWidth = this.headWidth = 13.6;
        }

        this.dotWidth = 4.5;
        this.dotMargin = 2.5;

        this.calculateSize();
    }

    Euterpe.extend(Euterpe.Node, Note, {
        beamRealHeight: 45,

        /** @private */
        calculateSize: function() {
            if(this.beamDir === "up") {
                this.realHeight = [this.beamRealHeight, this.headHeight / 2];
            }
            else if(this.beamDir === "down") {
                this.realHeight = [this.headHeight / 2, this.beamRealHeight];
            }

            this.realWidth += (this.dotMargin + this.dotWidth) * this.dots;

            if(this.flags > 0) {
                this.realWidth += 13.3;
            }
        },

        /**
         * Render object
         * @param {Number} x
         * @param {Number} y
         * @param {Number} scale
         * @returns {Kinetic.*}
         *
         */
        render: function(x, y, scale) {
            /** @public */
            this.beamWidth = 1.3 * scale;

            /** @public */
            this.beamHeight = this.beamRealHeight * scale;

            this.scale = scale;
            this.startX = x + this.headWidth * scale / 2;
            this.startY = y;

            var rendered = [];

            switch(this.type) {
                case "whole":
                    rendered = this.initWhole();
                    break;
                default:
                    rendered = this.initHalfQuarter();
            }

            if(this.dots > 0) {
                var yOff = 0;
                var line = this.location;

                // Note itself is located on the line
                // Need to shift the dot upwards
                if(line % 1 === 0) {
                    yOff = 3 * scale;
                }

                var _x = x + this.headWidth * scale;

                for(var i=this.dots; i > 0; i--) {
                    _x += (this.dotMargin * scale + this.dotWidth * scale / 2);

                    rendered.push(
                        new Kinetic.Ellipse({
                            x: _x,
                            y: this.Y - yOff,
                            radius: {
                                x: 2 * this.scale,
                                y: 2 * this.scale
                            },

                            fill: "black"
                        })
                    );

                    _x += this.dotWidth * scale / 2;
                }
            }

            Euterpe.bind(this, rendered);

            return rendered;
        },

        /**
         * Make a whole head
         *
         * @private
         */
        initWhole: function() {
            var extEl = new Kinetic.Ellipse({
                x: this.startX,
                y: this.startY,
                radius: {
                    x: 10.5 * this.scale,
                    y: 6.5 * this.scale
                },

                fill: "black"
            });

            var intEl = new Kinetic.Ellipse({
                x: this.startX,
                y: this.startY,
                radius: {
                    x: 5.5 * this.scale,
                    y: 4.0 * this.scale
                },

                fill: "white"
            });

            intEl.rotation(45);

            return [extEl, intEl];
        },

        /**
         * Make a half and quarter head
         *
         * @private
         */
        initHalfQuarter: function() {
            var rendered = [];
            var self = this;

            var extEl = new Kinetic.Ellipse({
                x: this.startX,
                y: this.startY,
                radius: {
                    x: 7.6 * this.scale,
                    y: 5.6 * this.scale
                },

                fill: "black"
            });

            extEl.rotation(140);
            rendered.push(extEl);

            if(this.type === "half") {
                var intEl = new Kinetic.Ellipse({
                    x: this.startX,
                    y: this.startY,
                    radius: {
                        x: 6.6 * this.scale,
                        y: 2.5 * this.scale
                    },

                    fill: "white"
                });

                intEl.rotation(140);

                rendered.push(intEl);
            }

            var bX, bY;

            // Check if beam is needed
            if(typeof this.beamDir === 'string') {
                if(this.beamDir === 'up') {
                    bX = extEl.x() + (extEl.width() / 2) -
                         this.beamWidth - (this.beamWidth / 3);
                    bY = extEl.y();

                    this.beam = new Kinetic.Line({
                        points: [0, 0, 0, -this.beamHeight],
                        stroke: 'black',
                        strokeWidth: this.beamWidth,
                        x: bX,
                        y: bY
                    });

                    rendered.push(this.beam);
                }
                else if(this.beamDir === 'down') {
                    bX = extEl.x() - (extEl.width() / 2) +
                         this.beamWidth + (this.beamWidth / 3);
                    bY = extEl.y();

                    this.beam = new Kinetic.Line({
                        points: [0, 0, 0, this.beamHeight],
                        stroke: 'black',
                        strokeWidth: this.beamWidth,
                        x: bX,
                        y: bY
                    });

                    rendered.push(this.beam);
                }

                var flagOff = 0;

                var flagF = function(fx, fy) {
                    return new Kinetic.Shape(
                       {
                           sceneFunc: function(ctx) {
                               ctx.beginPath();
                               ctx.moveTo(fx, fy);
                               ctx.bezierCurveTo(
                                  fx + 6.2 * self.scale, fy + 11.8 * m * self.scale,
                                  fx + 21.4 * self.scale, fy + 10.4 * m * self.scale,
                                  fx + 10 * self.scale, fy + 26.4 * m * self.scale);

                               ctx.bezierCurveTo(
                                  fx + 19.6 * self.scale, fy + 12.4 * m * self.scale,
                                  fx + 5.4 * self.scale, fy + 10.4 * m * self.scale,
                                  fx - 0.2 * self.scale, fy + 7.4 * m * self.scale);

                               ctx.closePath();

                               ctx.fillStrokeShape(this);
                           },
                           fill: 'black',
                           stroke: 'black',
                           strokeWidth: 0
                       });
                };

                // Check for flags
                while(this.flags >= 1) {
                    var fx = this.beam.x();
                    var fy;
                    var m = 1;

                    if(this.beamDir === 'up') {
                        fy = this.beam.y() - this.beamHeight;
                    }
                    else {
                        fy =  this.beam.y() + this.beamHeight;
                        m = -1;
                    }

                    fy += flagOff * m;

                    rendered.push(flagF(fx, fy));

                    this.flags -= 1;

                    flagOff += 9 * self.scale;
                }
            }

            return rendered;
        }
    });

    return Note;
}());
