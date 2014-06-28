/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginNoteBar = (function() {
    /**
     * PluginNoteBar [plugin]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginNoteBar = function(config) {
        PluginNoteBar.super.call(this, "Euterpe.PluginNoteBar", config);

        this.notes = [];
    };

    Euterpe.extend(Euterpe.Plugin, PluginNoteBar, {
        events: [
            {
                event: "beforePrepareNode",
                filter: function(item) {
                    return item.name === "Euterpe.Note" && !this.isMarked(item)
                },
                handler: "beforePrepareNode"
            }
        ],

        beforePrepareNode: function(item) {
            var config = item.config || {};

            if(config.bar === 'end') {
                item.__note_bar_flags = item.flags;
                item.flags = 0;

                this.notes.push([Euterpe.getStack(item), this.mark(item)]);

                var hbox = new Euterpe.HBox({
                    items: _.map(this.notes, function(obj) {return obj[0]}),
                    leftMargin: this.notes[0].leftMargin
                });

                hbox.add(new Bar(_.map(this.notes,
                         function(obj) {return obj[1]})));

                this.notes.length = 0;

                return hbox;
            }
            else if(config.bar === 'begin' || config.bar === 'cont') {
                item.__note_bar_flags = item.flags;
                item.flags = 0;

                this.notes.push([Euterpe.getStack(item), this.mark(item)]);

                return null;
            }

            return item;
        },

        mark: function(item) {
            item.__processedByPluginNote = true;

            return item;
        },

        isMarked: function(item) {
            return item.__processedByPluginNote === true;
        }
    });

    /**
     * Draw a bar between notes
     *
     * @private
     * @param {[Euterpe.Note]} notes to join with bar
     */
    function Bar(notes) {
        this.notes = notes;
        this.realWidth = 0;

        Bar.super.call(this, "Euterpe.PluginNoteBar.Bar");
    }

    Euterpe.extend(Euterpe.Node, Bar, {
        prepare: function(_x, _y, scale) {
            this.scale = scale;
            var first = this.notes[0];
            var last = this.notes[1];

            this.bar = new Kinetic.Shape({
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
        },

        getPrepared: function() {
            return this.bar;
        }
    });

    return PluginNoteBar;
}());
