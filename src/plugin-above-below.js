/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginAboveBelow = (function() {
    /**
     * PluginAboveBelow [plugin]
     * Calculates correct locations for above/below column items
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginAboveBelow = function(config) {
        PluginAboveBelow.super.call(this, "Euterpe.PluginAboveBelow", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginAboveBelow, {
        /** @private **/
        roundLine: function(val) {
            var d, r;

            if(val < 0) {
                d = val - Math.ceil(val);

                if(d === 0) {
                    r = val;
                }
                else if(d >= -0.5) {
                    r = Math.ceil(val) - 0.5;
                }
                else {
                    r = Math.floor(val);
                }

                return r;
            }
            else {
                d = val - Math.floor(val);

                if(d === 0) {
                    r = val;
                }
                else if(d <= 0.5) {
                    r = Math.floor(val) + 0.5;
                }
                else {
                    r = Math.ceil(val);
                }

                return r;
            }
        },

        /** @private **/
        place: function(items, scale, pos, startLoc) {
            var loc = 0, prevLoc;
            var h, up, down;

            if(typeof startLoc === "number") {
                prevLoc = startLoc;
            }
            else if(pos === "above") {
                prevLoc = 0;
            }
            else if(pos === "below") {
                prevLoc = 4;
            }

            for(var j=0; j < items.length; j++) {
                var item = items[j];

                h = item.getRealHeight(scale, true);
                up = h[0] / this.lineH;
                down = h[1] / this.lineH;

                if(pos === "above") {
                    loc = prevLoc - this.roundLine(down);
                    prevLoc = loc - this.roundLine(up);
                }
                else if(pos === "below") {
                    loc = prevLoc + this.roundLine(down);
                    prevLoc = loc + this.roundLine(up);
                }

                item.config.location = loc;
            }
        },

        process: function(root, scale) {
            this.lineH = Euterpe.global.linePadding + Euterpe.global.lineWidth;

            var columns = Euterpe.select("Euterpe.Column", root);

            for(var i=0; i < columns.length; i++) {
                var column = columns[i];
                var cfg = column.config;

                var h = column.getRealHeight(scale, true);
                var up = this.roundLine(h[0] / this.lineH * -1);
                var down = this.roundLine(h[1] / this.lineH);

                if(down < 4) {
                    down = 4;
                }

                if(_.isArray(cfg.aboveItems)) {
                    this.place(cfg.aboveItems, scale, "above", up);
                }

                if(_.isArray(cfg.belowItems)) {
                    this.place(cfg.belowItems, scale, "below", down);
                }
            }

            return root;
        }
    });

    return PluginAboveBelow;
}());
