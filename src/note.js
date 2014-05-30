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
     * @param {Object} [config.location] - Location of the note
     */

    function Note(config) {
        this.type = Euterpe.get_config(config, "type", "quarter");
        this.beamDir = Euterpe.get_config(config, "beamDirection", undefined);
        this.flags = Euterpe.get_config(config, "flags", 0);
        this.location = Euterpe.get_config(config, "location", undefined);

        if(this.type === "whole") {
            this.realWidth = 21.2;
        }
        else {
            this.realWidth = 14;
        }
    }

    Note.prototype = {

        /**
         * Prepare object
         * @param x
         * @param y
         * @param scale
         * @returns {Kinetic.*}
         */
        prepare: function(x, y, scale) {
            this.scale = scale;
            this.startX = x + this.realWidth / 2;
            this.startY = y;

            switch(this.type) {
                case "whole":
                    this.group = this.initWhole();
                    break;
                default:
                    this.group = this.initHalfQuarter();
            }

            return this.group;
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

            var group = new Kinetic.Group({});
            group.add(extEl);
            group.add(intEl);

            return group;
        },

        /**
         * Make a half and quarter head
         *
         * @private
         */
        initHalfQuarter: function() {
            var group = new Kinetic.Group({});
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
            group.add(extEl);

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

                group.add(intEl);
            }

            var beamWidth = 1.3 * this.scale;
            var beamHeight = 30 * this.scale;
            var bX, bY, beam;

            // Check if beam is needed
            if(typeof this.beamDir === 'string') {
                if(this.beamDir === 'up') {
                    bX = extEl.x() + (extEl.width() / 2) - beamWidth - (beamWidth / 3);
                    bY = extEl.y();

                    beam = new Kinetic.Line({
                        points: [0, 0, 0, -beamHeight],
                        stroke: 'black',
                        strokeWidth: beamWidth,
                        x: bX,
                        y: bY
                    });

                    group.add(beam);
                }
                else if(this.beamDir === 'down') {
                    bX = extEl.x() - (extEl.width() / 2) + beamWidth + (beamWidth/3);
                    bY = extEl.y();

                    beam = new Kinetic.Line({
                        points: [0, 0, 0, beamHeight],
                        stroke: 'black',
                        strokeWidth: beamWidth,
                        x: bX,
                        y: bY
                    });

                    group.add(beam);
                }

                // Check for flags
                if(this.flags == 1) {
                    var fx = beam.x();
                    var fy = beam.y() - beamHeight;

                    var flag = new Kinetic.Shape({
                        sceneFunc: function(ctx) {
                            ctx.beginPath();
                            ctx.moveTo(fx, fy);
                            ctx.bezierCurveTo(
                                fx + 6.2 * self.scale, fy + 11.8 * self.scale,
                                fx + 21.4 * self.scale, fy + 10.4 * self.scale,
                                fx + 10 * self.scale, fy + 26.4 * self.scale);

                            ctx.bezierCurveTo(
                                fx + 19.6 * self.scale, fy + 12.4 * self.scale,
                                fx + 5.4 * self.scale, fy + 10.4 * self.scale,
                                fx - 0.2 * self.scale, fy + 7.4 * self.scale);

                            ctx.closePath();

                            ctx.fillStrokeShape(this);
                        },
                        fill: 'black',
                        stroke: 'black',
                        strokeWidth: 1
                    });

                    group.add(flag);
                }
            }

            return group;
        }
    };

    return Note;
}());
