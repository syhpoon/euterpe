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
            var tuplets = {};
            var dir = 1;
            var dirs = {};
            var texts = {};
            var tid = null;

            for(var i=0; i < columns.length; i++) {
                var column = columns[i];

                for(var j=0; j < column.items.length; j++) {
                    var item = column.items[j];
                    var cfg = item.config || {};

                    if(cfg.tuplet === 'begin') {
                        tid = Euterpe.randomString(10);
                    }

                    var tupletId = cfg.tupletId || tid;

                    if(!_.isArray(tuplets[tupletId])) {
                        tuplets[tupletId] = [];
                    }

                    if(cfg.tuplet === 'begin' || cfg.tuplet === 'cont' ||
                        cfg.tuplet === 'end') {

                        if(cfg.tuplet === 'begin') {
                            dir = cfg.tupletPosition === 'bottom' ? 1 : -1;
                            dirs[ids.length] = dir;
                            texts[ids.length] = cfg.tupletText;
                        }

                        tuplets[tupletId].push(item.id);

                        if(cfg.tuplet === 'end') {
                            ids.push(_.clone(tuplets[tupletId]));

                            tuplets[tupletId].length = 0;
                        }
                    }
                }
            }

            for(var k=0; k < ids.length; k++) {
               extra.push(this.bind(ids[k], dirs[k], texts[k]));
            }

            return root;
        },

        /** @private */
        bind: function(ids, dir, text) {
            ids = _.map(ids, function(obj) {return Euterpe.select("#"+obj)[0];});

            return function(root, scale) {
                var scene = function(fx, fy, lx, ly, fxEnd, fyEnd,
                                     headHeight, headWidth, width) {
                    return function(ctx) {

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

                if(text) {
                    var txt = new Euterpe.Text({
                        text: text,
                        fontSize: 12
                    });
                    txtW = txt.getRealWidth(scale, true);
                }

                var width = 1 * scale * dir;
                var headWidth = 1 * scale;
                var headHeight = 5 * scale * dir;
                var assets = [];
                var first = ids[0];
                var last = ids[ids.length - 1];
                var fx = first.X;
                var fy = first.Y + first.getRealHeight(scale) * dir;
                var lx = last.X;
                var ly = last.Y + last.getRealHeight(scale) * dir;
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
                if(text) {
                    assets.push(txt.render(fxEnd + txtW / 2,
                                           fyEnd + headHeight, scale));
                }

                return assets;
            };
        }
    });

    return PluginTuplet;
}());
