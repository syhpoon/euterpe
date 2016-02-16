/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014-2016
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginTuplet = (function() {
    /**
     * PluginTuplet [plugin]
     * Adds attributes to Euterpe.Note:
     * 'tuplet' = "begin"|"cont"|"end"
     * 'tupletId' - Optional tuplet id
     * 'tupletText' - Optional tuplet text
     * 'tupletPosition' = "top" | "bottom"
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginTuplet = function(config) {
        PluginTuplet.super.call(this, "Euterpe.PluginTuplet", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginTuplet, {
        process: function(root, scale, extra) {
            var columns = Euterpe.select("Euterpe.Column", root);

            var ids = [];
            var parentRows = [];
            var tuplets = {};
            var dir = 1;
            var dirs = {};
            var texts = {};
            var order = {};
            var cur = 0;
            var tid = null;

            for(var i=0; i < columns.length; i++) {
                var column = columns[i];

                for(var j=0; j < column.items.length; j++) {
                    var item = column.items[j];
                    var cfg = item.config || {};

                    if(cfg.tuplet === 'begin' || cfg.tuplet === 'cont' ||
                        cfg.tuplet === 'end') {

                        if(cfg.tuplet === 'begin') {
                            tid = Euterpe.randomString(10);
                        }

                        var tupletId = cfg.tupletId || tid;

                        if(!_.isArray(tuplets[tupletId])) {
                            tuplets[tupletId] = [];
                        }

                        if(cfg.tuplet === 'begin') {
                            dir = cfg.tupletPosition === 'bottom' ? 1 : -1;
                            dirs[tupletId] = dir;
                            texts[tupletId] = cfg.tupletText;
                        }

                        tuplets[tupletId].push(item.id);

                        if(cfg.tuplet === 'end') {
                            ids.push(_.clone(tuplets[tupletId]));
                            order[cur++] = tupletId;

                            parentRows.push(
                                Euterpe.getParent(item, "Euterpe.Row"));

                            tuplets[tupletId].length = 0;
                        }
                    }
                }
            }

            for(var k=0; k < ids.length; k++) {
                var row = parentRows[k];
                var brace = this.newBrace(ids[k], dirs[order[k]],
                                          texts[order[k]], row);

                if(dirs[order[k]] > 0) {
                    row.addBottomOob(brace);
                } else {
                    row.addTopOob(brace);
                }
            }

            return root;
        },

        /** @private */
        newBrace: function(ids, dir, text, row) {
            var config = {
                firstId: ids[0],
                lastId: ids[ids.length - 1],
                width: 1 * dir,
                headWidth: 1,
                headHeight: 5,
                dir: dir,
                text: text
            };

            var first = Euterpe.select("#"+config.firstId, row)[0];
            var last = Euterpe.select("#"+config.lastId, row)[0];

            var startX = Euterpe.getDistance(row, first, 1);
            var endX = Euterpe.getDistance(row, last, 1);
            var height = config.headHeight + config.headWidth;

            return new TupletOob(startX, endX, height, config);
        }
    });

    var TupletOob = function(startX, endX, height, config) {
        TupletOob.super.call(this, "TupletOob", startX, endX, height, config);
    };

    Euterpe.extend(Euterpe.Oob, TupletOob, {
        render: function(x, y, scale, parent) {
            var scene = function(fx, fy, lx, ly, fxEnd, fyEnd,
                                 headHeight, headWidth, width) {
                return function(ctx) {

                    // Left bracket
                    ctx.beginPath();
                    ctx.moveTo(fx, fy);
                    ctx.lineTo(fx, fy + headHeight + width);
                    ctx.lineTo(fxEnd, fyEnd + headHeight + width);
                    ctx.lineTo(fxEnd, fyEnd + headHeight);
                    ctx.lineTo(fx + headWidth, fy + headHeight);
                    ctx.lineTo(fx + headWidth, fy);
                    ctx.moveTo(fx, fy);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);

                    // Right bracket
                    ctx.beginPath();
                    ctx.moveTo(lx, ly);
                    ctx.lineTo(lx, ly + headHeight + width);
                    ctx.lineTo(lxEnd, lyEnd + headHeight + width);
                    ctx.lineTo(lxEnd, lyEnd + headHeight);
                    ctx.lineTo(lx - headWidth, ly + headHeight);
                    ctx.lineTo(lx - headWidth, ly);
                    ctx.moveTo(lx, ly);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                };
            };

            // Need to insert text in between
            var txtW = 0;

            if(this.config.text) {
                var txt = new Euterpe.Text({
                    text: this.config.text,
                    fontSize: 12
                });
                txtW = txt.getRealWidth(scale, true);
            }

            var assets = [];

            var width = this.config.width * scale;
            var headHeight = this.config.headHeight * this.config.dir * scale;
            var headWidth = this.config.headWidth * scale;
            var dir = this.config.dir;

            var first = Euterpe.select("#"+this.config.firstId, parent)[0];
            var last = Euterpe.select("#"+this.config.lastId, parent)[0];

            var y1, y2;

            if(dir > 0 && first.Y < last.Y) {
                //y1 = y + (last.Y - first.Y);
                y1 = y + 6 * scale;
                y2 = y;
            } else {
                y1 = y;
                //y2 = y + (last.Y - first.Y);
                y2 = y + 6 * scale;
                //y2 = last.Y + last.getRealHeight(scale) * dir + 6 * scale;
            }

            var fx = first.X;
            var fy = y1;
            var lx = last.X;
            var ly = y2;
            var len = (lx - fx) / 2 - txtW / 2;
            var slope = (ly - fy) / (lx - fx);
            var intercept = (slope * lx - ly) * -1;
            var fxEnd = fx + len - txtW / 2;
            var fyEnd = fxEnd * slope + intercept;
            var lxEnd = lx - len + txtW / 2;
            var lyEnd = lxEnd * slope + intercept;

            assets.push(new Kinetic.Shape({
                sceneFunc: scene(fx, fy, lx, ly, fxEnd,
                                 fyEnd, headHeight, headWidth, width),
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            }));

            // Need to insert text in between
            if(this.config.text) {
                assets.push(txt.render(fxEnd + txtW / 2,
                                       fyEnd + headHeight, scale));
            }

            return assets;
        }
    });

    return PluginTuplet;
}());
