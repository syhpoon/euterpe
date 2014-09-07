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
     * @param {Number} [config.lineMargin=5] - Margin between lines
     */
    var PluginPackMeasures = function(config) {
        this.totalWidth = Euterpe.getConfig(config, "totalWidth");
        this.measuresPerLine = Euterpe.getConfig(config, "measuresPerLine", 3);
        this.lineMargin = Euterpe.getConfig(config, "lineMargin", 5);

        PluginPackMeasures.super.call(this, "Euterpe.PluginPackMeasures", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginPackMeasures, {
        process: function(root, scale) {
            var tmp = [];
            var clef = null;
            var barType = 'single';
            var multi = new Euterpe.Multiline({
                lineMargin: this.lineMargin * scale
            });

            var f = function(a, o) { return a + o.getRealWidth(scale);};

            for(var i=0; i < root.items.length; i++) {
                var item = root.items[i];

                if(i === 0) {
                    // Also save clef, we need to replicate it on the first
                    // measure of every line
                    clef = Euterpe.select("Euterpe.TrebleClef", item)[0];
                }
                else if(tmp.length === 0) {
                    item.items.splice(0, 0, clef.clone());
                }

                item.leftBarType = barType;

                tmp.push(item);

                // XXX: For now assume that measures are placed as top-level
                // containers. Probably needs to be changed in future
                if((i + 1) % this.measuresPerLine === 0 ||
                    i == root.items.length - 1) {

                    barType = 'single';

                    var subset = (tmp.length === 1 &&
                                  i === root.items.length - 1) ? [item]: tmp;

                    var width = _.reduce(subset, f, 0);
                    var marginsCount = this.calcMargins(subset);

                    this.fit(subset,
                        (this.totalWidth - width) / marginsCount.count * scale,
                        marginsCount.left, marginsCount.right);

                    multi.add(new Euterpe.HBox({items: tmp}));

                    tmp.length = 0;
                }
                else {
                    barType = 'none';
                }
            }

            root.clear();
            root.add(multi);

            return root;
        },

        calcMargins: function(measures) {
            var count = 0;
            var left = {};
            var right = {};

            for(var i=0; i < measures.length; i++) {
                var mcount = 0;
                var measure = measures[i];
                var notes = Euterpe.select("Euterpe.Note", measure);

                for(var j=0; j < notes.length; j++) {
                    var itm = this.findLeftmostMargin(measure.id, notes[j]);

                    if(typeof itm !== 'undefined' && !left[itm.id]) {
                        mcount += 1;
                        left[itm.id] = true;
                    }

                    itm = this.findRightmostMargin(measure.id, notes[j]);

                    if(typeof itm !== 'undefined' && !right[itm.id]) {
                        mcount += 1;
                        right[itm.id] = true;
                    }
                }

                count += mcount;
            }

            return {
                count: count,
                left: left,
                right: right
            };
        },

        findLeftmostMargin: function(rootId, item) {
            if(item.leftMargin) {
                return item;
            }

            var parent = item.parentContainer;
            var idx = this.getItemIndex(parent, item.id);

            for(var i=idx; i >= 0; i--) {
                if(parent.items[i].leftMargin) {
                    return parent.items[i];
                }
            }

            if(parent.id === rootId) {
                return undefined;
            }

            return this.findLeftmostMargin(rootId, parent);
        },

        findRightmostMargin: function(rootId, item) {
            if(item.rightMargin) {
                return item;
            }

            var parent = item.parentContainer;
            var idx = this.getItemIndex(parent, item.id);

            for(var i=idx; i > parent.items.length; i++) {
                if(parent.items[i].rightMargin) {
                    return parent.items[i];
                }
            }

            if(parent.id === rootId) {
                return undefined;
            }

            return this.findRightmostMargin(rootId, parent);
        },

        getItemIndex: function(parent, childId) {
            for(var i=0; i < parent.items.length; i++) {
                if(parent.items[i].id === childId) {
                    return i;
                }
            }

            return undefined;
        },

        fit: function(items, extra, left, right) {
            for(var i=0; i < items.length; i++) {
                var itm = items[i];

                if(left[itm.id]) {
                    itm.leftMargin += extra;
                }

                if(right[itm.id]) {
                    itm.rightMargin += extra;
                }

                if(itm.isContainer) {
                    this.fit(itm.items, extra, left, right);
                }
            }
        }
    });

    return PluginPackMeasures;
}());
