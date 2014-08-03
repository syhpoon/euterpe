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
     * Adds attributes above, aboveRight, below, belowRight to notes and measures
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
            var d = val - Math.floor(val);

            if(d <= 0.49) {
                return Math.floor(val) + 0.5;
            }
            else {
                return Math.ceil(val);
            }
        },

        processMeasure: function(items, scale, pos, vbox) {
            var lineH = Euterpe.global.linePadding + Euterpe.global.lineWidth;
            var loc = 0, prevLoc;
            var h;
            var up, down;

            if(pos === "above") {
                prevLoc = 0;
            }
            else if(pos === "below") {
                prevLoc = 4;
            }

            for(var j=0; j < items.length; j++) {
                var item = items[j];

                h = item.getRealHeight(1, true);
                up = (h[0] * scale) / lineH;
                down = (h[1] * scale) / lineH;

                if(pos === "above") {
                    loc = prevLoc - this.roundLine(down);
                    prevLoc = loc - this.roundLine(up);
                }
                else if(pos === "below") {
                    loc = prevLoc + this.roundLine(down);
                    prevLoc = loc + this.roundLine(up);
                }

                item.config.location = loc;
                vbox.add(item);
            }
        },

        process: function(root, scale) {
            var measures = Euterpe.select("Euterpe.Measure", root);

            for(var i=0; i < measures.length; i++) {
                var measure = measures[i];
                var cfg = measure.config;
                var left, leftAdded = false;
                var right, rightAdded = false;

                if(_.isArray(cfg.above) || _.isArray(cfg.below)) {
                    if(!left) {
                        // Margin here because of measure number
                        left = new Euterpe.VBox({
                            leftMargin: 4 * scale
                        });
                    }

                    if(cfg.above) {
                        this.processMeasure(cfg.above,
                                            scale, "above", left);
                    }

                    if(cfg.below) {
                        this.processMeasure(cfg.below,
                                            scale, "below", left);
                    }

                    if(!leftAdded) {
                        measure.items.unshift(left);
                        leftAdded = true;
                    }
                }

                if(_.isArray(cfg.aboveRight) || _.isArray(cfg.belowRight)) {
                    if(!right) {
                        right = new Euterpe.VBox({});
                    }

                    if(cfg.aboveRight) {
                        this.processMeasure(cfg.aboveRight,
                                            scale, "above", right);
                    }

                    if(cfg.belowRight) {
                        this.processMeasure(cfg.belowRight,
                            scale, "below", right);
                    }

                    if(!rightAdded) {
                        measure.items.push(right);
                        rightAdded = true;
                    }
                }
            }

            return root;
        }
    });

    return PluginAboveBelow;
}());
