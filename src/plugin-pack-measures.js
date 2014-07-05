/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginPackMeasures = (function() {
    /**
     * PluginPackMeasures [plugin]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} config.totalWidth - Desired total width
     * @param {Number} [config.measuresPerLine=3] - How many measures per line to pack
     */
    var PluginPackMeasures = function(config) {
        this.totalWidth = Euterpe.getConfig(config, "totalWidth");
        this.measuresPerLine = Euterpe.getConfig(config, "measuresPerLine", 3);

        PluginPackMeasures.super.call(this, "Euterpe.PluginPackMeasures", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginPackMeasures, {
        process: function(root, scale) {
            var acc = [];
            var tmp = [];
            var first = null;
            var clef = null;
            var barType = 'single';

            for(var i=0; i < root.items.length; i++) {
                var item = root.items[i];

                if(i === 0) {
                    first = item.id;

                    // Also save clef, we need to replicate it on the first
                    // measure of every line
                    clef = Euterpe.select("Euterpe.TrebleClef", item)[0];
                }

                item.leftBarType = barType;

                if(tmp.length === 0 && acc.length !== 0) {
                    item.items.splice(0, 0, clef.clone());
                }

                tmp.push(item);

                // XXX: For now assume that measures are placed as top-level
                // containers. Probably needs to be changed in future
                if((i + 1) % this.measuresPerLine === 0 ||
                    i == root.items.length - 1) {

                    barType = 'single';

                    var subset = (tmp.length === 1 && i === root.items.length - 1)
                                  ? [item]: tmp;

                    var width = _.reduce(subset,
                        function(a, o) { return a + o.getRealWidth(scale)}, 0);

                    var marginsCount = this.calcMargins(subset);

                    this.fit(subset,
                        (this.totalWidth - width) / marginsCount * scale);

                    acc = acc.concat(tmp);
                    tmp.length = 0;

                    acc.push(function(state) {
                        state.x = Euterpe.select("#"+first)[0].X;
                        state.y += 170 * scale;
                    });
                }
                else {
                    barType = 'none';
                }
            }

            root.items = acc;

            return root;
        },

        calcMargins: function(items) {
            var count = 0;

            for(var i=0; i < items.length; i++) {
                var itm = items[i];

                if(this.canChangeMargins(itm)) {
                    if(itm.leftMargin) {
                        count += 1;
                    }

                    if(itm.rightMargin) {
                        count += 1;
                    }

                    if(itm.isContainer) {
                        count += this.calcMargins(itm.items);
                    }
                }
            }

            return count;
        },

        canChangeMargins: function(item) {
            return Euterpe.select("Euterpe.Note", item).length > 0;
        },

        fit: function(items, extra) {
            for(var i=0; i < items.length; i++) {
                var itm = items[i];

                if(this.canChangeMargins(itm)) {
                    if(itm.leftMargin) {
                        itm.leftMargin += extra;
                    }
                    if(itm.rightMargin) {
                        itm.rightMargin += extra;
                    }

                    if(itm.isContainer) {
                        this.fit(itm.items, extra);
                    }
                }
            }
        }
    });

    return PluginPackMeasures;
}());
