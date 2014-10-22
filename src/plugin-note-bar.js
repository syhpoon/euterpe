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
            var dir = 1;
            var dirs = {};

            for(var i=0; i < columns.length; i++) {
                var column = columns[i];

                for(var j=0; j < column.items.length; j++) {
                    var item = column.items[j];
                    var cfg = item.config || {};

                    if(cfg.bar === 'begin' || cfg.bar === 'cont' ||
                        cfg.bar === 'end') {
                        dir = cfg.beamDirection === 'down' ? -1: 1;
                        dirs[ids.length] = dir;

                        item.__note_bar_flags = item.flags;
                        item.flags = 0;
                        current.push(item.id);

                        if(cfg.bar === 'end') {
                            this.adjustBeamHeight(current, dir, scale);
                            ids.push(_.clone(current));

                            current.length = 0;
                        }
                    }
                }
            }

            for(var k=0; k < ids.length; k++) {
               extra.push(this.bind(ids[k], dirs[k]));
            }

            return root;
        },

        /** @private */
        getTopTwo: function(items, dir) {
            var sorted = _.clone(items);

            sorted.sort(function(a, b) {
                if(dir === 1) {
                    return a.config.location - b.config.location;
                }
                else {
                    return b.config.location - a.config.location;
                }
            });

            if(sorted.length > 2) {
                return [sorted[0], sorted[1]];
            }
            else {
                return sorted;
            }
        },

        /** @private */
        adjustBeamHeight: function(ids, dir, scale) {
            ids = _.map(ids, function(obj) {return Euterpe.select("#"+obj)[0];});

            if(ids.length > 2) {
                var sorted = this.getTopTwo(ids, dir);
                var getY = function(item, baseY) {
                    return Euterpe.getY(item, scale, baseY) - item.beamRealHeight * scale * dir;
                };

                // Get the line equation based on the top two coordinates
                var first = sorted[0];
                var last = sorted[1];
                var row = first.parent.parent;
                var firstX = Euterpe.getDistance(row, first, scale);
                var lastX = Euterpe.getDistance(row, last, scale);

                // Change the beam height of all intermediate notes
                for(var i=0; i < ids.length; i++) {
                    var base = Math.abs(Euterpe.getY(ids[i], scale, 0));

                    var firstY = getY(first, base);
                    var lastY = getY(last, base);
                    var slope = (lastY - firstY) / (lastX - firstX);

                    var X = Euterpe.getDistance(row, ids[i], scale);
                    var curY = getY(ids[i], base);
                    var newY = slope * (X - firstX) + firstY;
                    var diff = curY - newY;

                    if(diff !== 0) {
                        ids[i].beamRealHeight += diff * dir / scale;
                        ids[i].calculateSize();
                    }
                }
            }
        },

        /** @private */
        bind: function(ids, dir) {
            return function(root, scale) {
                var scene = function(sx, sy, lx, ly, off, width, dir) {
                        return function(ctx) {
                            ctx.beginPath();
                            ctx.moveTo(sx, sy + off);
                            ctx.lineTo(lx, ly + off);
                            ctx.lineTo(lx, ly + off + width * dir);
                            ctx.lineTo(sx, sy + off + width * dir);
                            ctx.moveTo(sx, sy);

                            ctx.closePath();

                            ctx.fillStrokeShape(this);
                        }
                };

                var assets = [];
                var width = 4 * scale;
                var partial = 10 * scale;

                for(var z=0; z < ids.length - 1; z += 1) {
                    var first = Euterpe.select("#"+ids[z])[0];
                    var second = Euterpe.select("#"+ids[z+1])[0];

                    var sx = first.beam.x();
                    var sy = first.beam.y() - first.beamHeight * dir;
                    var lx = second.beam.x();
                    var ly = second.beam.y() - second.beamHeight * dir;
                    var slope = (ly - sy) / (lx - sx);
                    var fflags = first.__note_bar_flags;
                    var sflags = second.__note_bar_flags;
                    var flags = _.max([fflags, sflags]);

                    var off = 0;

                    for(var i=0; i < flags; i++) {
                        if(fflags > i && sflags > i) {}
                        else if(fflags > i) {
                            lx = sx + partial;
                            ly = sy + partial * slope;
                        }
                        else if(sflags > i) {
                            sx = lx - partial;
                            sy = ly - partial * slope;
                        }

                        var bar = new Kinetic.Shape({
                            sceneFunc: scene(sx, sy, lx, ly, off, width, dir),
                            fill: 'black',
                            stroke: 'black',
                            strokeWidth: 0
                        });

                        off += (width * dir + 3 * dir * scale);

                        assets.push(bar);
                    }
                }

                return assets;
            };
        }
    });

    return PluginNoteBar;
}());
