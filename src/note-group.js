/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.NoteGroup = (function() {
    /**
     * NoteGroup [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var NoteGroup = function(config) {
        NoteGroup.super.call(this, "Euterpe.NoteGroup", config);
    };

    Euterpe.extend(Euterpe.Container, NoteGroup, {
        events: {
            "ready": "onReady"
        },

        onReady: function() {
            if(this.group) {
                this.group.moveToBottom();
            }
        },

        prepare: function(x, y, scale) {
            var self = this;
            var first = null;
            var last = null;

            var cb = function(item, x, y, scale) {
                var itemY = Euterpe.getItemY(self.parentContainer, item, x, y, scale);

                if(first === null) {
                    first = item;
                }

                last = item;

                if(typeof item.prepareNoteGroup === 'function') {
                    return item.prepareNoteGroup(x, itemY, scale);
                }
                else {
                    return item.prepare(x, itemY, scale);
                }
            };

            this.group = new Kinetic.Group();

            _.each(this.basePrepare(x, y, scale, cb),
                function(prepared) {
                    self.group.add(prepared);
                });

            this.group.add(this.bar(first, last, scale));

            return this.group;
        },

        /**
         * Draw a bar between notes
         *
         * @private
         * @param {Euterpe.Note} first
         * @param {Euterpe.Note} last
         * @returns {Kinetic.Shape}
         */
        bar: function(first, last, scale) {
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    var sx = first.beam.x();
                    var sy = first.beam.y() - first.beamHeight;
                    var lx = last.beam.x();
                    var ly = last.beam.y() - last.beamHeight;
                    var width = 4 * scale;

                    ctx.beginPath();
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(lx, ly);
                    ctx.lineTo(lx, ly + width);
                    ctx.lineTo(sx, sy + width);
                    ctx.moveTo(sx, sy);

                    ctx.closePath();

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        }
    });

    return NoteGroup;
}());
