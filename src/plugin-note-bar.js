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
        process: function(root, scale, extra) {
            var columns = Euterpe.select("Euterpe.Column", root);

            var ids = [];
            var current = [];

            for(var i=0; i < columns.length; i++) {
                var column = columns[i];

                for(var j=0; j < column.items.length; j++) {
                    var item = column.items[j];
                    var cfg = item.config || {};

                    if(cfg.bar === 'begin' || cfg.bar === 'cont' ||
                        cfg.bar === 'end') {
                        item.flags = 0;
                        current.push(item.id);

                        if(cfg.bar === 'end') {
                            ids.push(_.clone(current));

                            current.length = 0;
                        }

                        continue;
                    }

                }
            }

            for(var k=0; k < ids.length; k++) {
               extra.push(this.bind(ids[k]));
            }

            return root;
        },

        /** @private */
        bind: function(ids) {
            return function(root, scale) {
                var first = Euterpe.select("#"+ids[0])[0];
                var last = Euterpe.select("#"+ids[1])[0];

                var bar = new Kinetic.Shape({
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

                return bar;
            };
        }
    });

    return PluginNoteBar;
}());
