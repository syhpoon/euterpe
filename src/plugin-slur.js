/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginSlur = (function() {
    /**
     * PluginSlur [plugin]
     * Adds attributes to Euterpe.Note:
     * 'slur' - "begin"|"cont"|"end"
     * 'slur_id' - Optional slur id
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginSlur = function(config) {
        PluginSlur.super.call(this, "Euterpe.PluginSlur", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginSlur, {
        process: function(root, scale, extra) {
            var notes = Euterpe.select("Euterpe.Note", root);
            var groups = [];
            var current = [];
            var dirs = [];
            var multiVoice = null;

            for(var i=0; i < notes.length; i++) {
                var note = notes[i];
                var cfg = note.config || {};
                var slur_cfg;

                if (_.isArray(cfg.slur)) {
                    slur_cfg = cfg.slur;
                }
                else {
                    slur_cfg = [
                        {
                            id: cfg.slur_id,
                            type: cfg.slur
                        }]
                }

                for (var j = 0; j < slur_cfg.length; j++) {
                    cfg = slur_cfg[j];

                    if (cfg.type === 'begin') {
                        var sid = Euterpe.randomString(10);
                    }

                    var slur_id = cfg.id || sid;

                    if (!_.isArray(current[slur_id])) {
                        current[slur_id] = [];
                    }

                    if (cfg.type === 'begin' || cfg.type === 'cont' ||
                        cfg.type === 'end') {

                        if(this.isMultiVoice(note)) {
                            multiVoice = note.config.beamDirection;
                        }

                        current[slur_id].push(note);

                        if (cfg.type === 'end') {
                            if(multiVoice !== null) {
                                dirs[groups.length] = multiVoice !== 'up';
                            }
                            else if(note.config.beamDirection == 'up') {
                                dirs[groups.length] = true;
                            }
                            else {
                                dirs[groups.length] = false;
                            }

                            groups.push(_.clone(current[slur_id]));

                            current.length = 0;
                            multiVoice = null;
                        }
                    }
                }
            }

            for(var k=0; k < groups.length; k++) {
                extra.push(this.makeSlur(groups[k], dirs[k], scale));
            }

            return root;
        },

        /** @private
         *
         * Check is note is a part of multivoice column
         *
         * @param note
         */
        isMultiVoice: function(note) {
            var parent = note.parent;

            if(typeof parent === 'undefined' ||
               parent.name !== 'Euterpe.Column') {
                return false;
            }

            return !_.all(parent.items, function(obj) {
                return obj.config.beamDirection === note.config.beamDirection;
            });
        },

        /** @private */
        makeSlur: function(group, up, scale) {
            if(group.length < 2) {
                throw "Slur group must contain two or more notes";
            }

            var firstId = group[0].id;
            var lastId = group[group.length - 1].id;
            var self = this;
            var m = up ? -1: 1;
            var curve = 23 * scale;
            var off = 2 * scale;
            var noteHeadOff = 10 * scale;

            return function(root, scale) {
                var first = Euterpe.select("#"+firstId, root)[0];
                var last = Euterpe.select("#"+lastId, root)[0];

                var slope = (last.Y - first.Y) / (last.X - first.X);

                var lineF = function(X) {
                    return slope * (X - first.X) + first.Y;
                };

                var firstX = first.X + first.headWidth / 2;
                var firstY = first.Y - noteHeadOff * m * scale;
                var lastX = last.X + last.headWidth / 2;
                var lastY = last.Y - noteHeadOff * m * scale;
                var vertexX;

                var midIdx = Math.floor(group.length / 2);

                if(group.length % 2) {
                    var midObj = Euterpe.select("#"+group[midIdx].id, root)[0];

                    vertexX = midObj.X;
                }
                else {
                    var midObj1 = Euterpe.select("#"+group[midIdx-1].id, root)[0];
                    var midObj2 = Euterpe.select("#"+group[midIdx].id, root)[0];

                    vertexX = (midObj1.X + midObj2.X) / 2;
                }

                var vertexY1 = lineF(vertexX) - curve * m * scale;
                var vertexY2 = lineF(vertexX) - (curve + off) * m * scale;

                // Now iterate over all the notes from the second to
                // the last but one
                for (var i = 1; i < group.length - 1; i++) {
                    while(true) {
                        // Get the parabola equation
                        var pEq = self.getParabolaEq([firstX, firstY],
                                                     [vertexX, vertexY2],
                                                     [lastX, lastY]);

                        var note = group[i];
                        var y = pEq(note.X);

                        if((up && (note.Y > y - 10 * scale)) ||
                           (!up && (note.Y - y) < 10 * scale)) {
                            vertexY1 -= 10 * m * scale;
                            vertexY2 = vertexY1 - off * m * scale;
                        }
                        else {
                            break;
                        }
                    }
                }

                // Calculate control point
                var cpX = 2 * vertexX - firstX / 2 - lastX / 2;
                var cpY1 = 2 * vertexY1 - firstY / 2 - lastY / 2;
                var cpY2 = 2 * vertexY2 - firstY / 2 - lastY / 2;

                return new Kinetic.Shape(
                   {
                       sceneFunc: function(ctx) {
                           ctx.beginPath();
                           ctx.moveTo(firstX, firstY);

                           ctx.quadraticCurveTo(cpX, cpY1, lastX, lastY);
                           ctx.quadraticCurveTo(cpX, cpY2, firstX, firstY);

                           ctx.closePath();

                           ctx.fillStrokeShape(this);
                       },

                       fill: 'black',
                       stroke: 'black',
                       strokeWidth: 2
                   }
                );
            };
        },

        /** @private */
        getParabolaEq: function(first, mid, last) {
            var B = [first[1], mid[1], last[1]];
            var A = [[Math.pow(first[0], 2), first[0], 1],
                     [Math.pow(mid[0], 2), mid[0], 1],
                     [Math.pow(last[0], 2), last[0], 1]];

            var res = numeric.solve(A,B);

            var a = res[0];
            var b = res[1];
            var c = res[2];

            return function(X) {
                return a * Math.pow(X,2) + b * X + c;
            };
        }
    });

    return PluginSlur;
}());
