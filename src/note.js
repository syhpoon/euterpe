//
// Euterpe.js
//
// Max E. Kuznetsov <mek@mek.uz.ua>
// Copyright MuzMates 2014

// Params
//  * x :: float() - x coordinate of the center
//  * y :: float() - y coordinate of the center
//  * type :: whole | half | quarter - note head type
//  * scale :: float() - stave scale
//  * beamDirection :: up | down - Beam direction

// Public object attributes:
//  * group :: Kinetic.Group()

Euterpe.Note = (function() {
    function Note(config) {
        this.init(config);
    }

    Note.prototype = {
        init: function(cfg) {
            this.scale = Euterpe.get_config(cfg, "scale", 1.0);
            this.startX = Euterpe.get_config(cfg, "x", 0);
            this.startY = Euterpe.get_config(cfg, "y", 0);
            this.type = Euterpe.get_config(cfg, "type", "quarter");
            this.beamDir = Euterpe.get_config(cfg, "beamDirection", undefined);

            switch(this.type) {
                case "whole":
                    this.group = this.initWhole();
                    break;
                default:
                    this.group = this.initHalfQuarter();
            }
        },

        // Make a whole head
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

        // Make a half and quarter head
        initHalfQuarter: function() {
            var group = new Kinetic.Group({});

            var extEl = new Kinetic.Ellipse({
                x: this.startX,
                y: this.startY,
                radius: {
                    x: 7.5 * this.scale,
                    y: 5.5 * this.scale
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
                        x: 6.5 * this.scale,
                        y: 2.4 * this.scale
                    },

                    fill: "white"
                });

                intEl.rotation(140);

                group.add(intEl);
            }

            var beamWidth = 1.3 * this.scale;
            var beamHeight = 30 * this.scale;

            // Check if beam is needed
            if(this.beamDir === 'up') {
                var bX = extEl.x() + (extEl.width() / 2) - beamWidth - (beamWidth/3);
                var bY = extEl.y();

                var beam = new Kinetic.Line({
                    points: [0, 0, 0, -beamHeight],
                    stroke: 'black',
                    strokeWidth: beamWidth,
                    x: bX,
                    y: bY
                });

                group.add(beam);
            }
            else if(this.beamDir === 'down') {
                var bX = extEl.x() - (extEl.width() / 2) + beamWidth + (beamWidth/3);
                var bY = extEl.y();

                var beam = new Kinetic.Line({
                    points: [0, 0, 0, beamHeight],
                    stroke: 'black',
                    strokeWidth: beamWidth,
                    x: bX,
                    y: bY
                });

                group.add(beam);
            }

            return group;
        }
    };

    return Note;
}());
