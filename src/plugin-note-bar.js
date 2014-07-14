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
     * Adds 'bar' = "begin"|"cont"|"end" attribute to Euterpe.Note
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginNoteBar = function(config) {
        PluginNoteBar.super.call(this, "Euterpe.PluginNoteBar", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginNoteBar, {
        process: function(root) {
            var measures = Euterpe.select("Euterpe.Measure", root);

            var f0 = function(obj) {return obj[0];};
            var f1 = function(obj) {return obj[1];};

            for(var i=0; i < measures.length; i++) {
                var m = measures[i];
                var acc = [];
                var tmp = [];

                for(var j=0; j < m.items.length; j++) {
                    var itm = m.items[j];
                    var hasBar = false;

                    var notes = Euterpe.select("Euterpe.Note", itm);

                    if(notes.length > 0) {
                        for(var k=0; k < notes.length; k++) {
                            var note = notes[k];
                            var cfg = note.config || {};

                            if(cfg.bar === 'begin' ||
                                cfg.bar === 'cont' || cfg.bar === 'end') {
                                hasBar = true;
                                note.__note_bar_flags = note.flags;
                                note.flags = 0;

                                tmp.push([note.id, itm]);

                                if(cfg.bar === 'end') {
                                    var hbox = new Euterpe.HBox({
                                        items: _.map(tmp, f1)
                                    });

                                    hbox.add(new Bar(_.map(tmp, f0)));

                                    tmp.length = 0;

                                    acc.push(hbox);
                                }
                            }
                        }
                    }

                    if(!hasBar) {
                        acc.push(itm);
                    }
                }

                m.items = acc;
            }

            return root;
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
        render: function(_x, _y, scale) {
            this.scale = scale;
            var first = Euterpe.select("#"+this.notes[0])[0];
            var last = Euterpe.select("#"+this.notes[1])[0];

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

            return this.bar;
        }
    });

    return PluginNoteBar;
}());
