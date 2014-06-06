/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.VAlignLeft = (function() {
    /**
     * Left vertical align [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    function VAlignLeft(config) {
        VAlignLeft.super.call(this, "Euterpe.VAlignLeft", config);
    }

    Euterpe.extend(Euterpe.Container, VAlignLeft, {
        // Override width calculation
        calculateWidth: function(scale) {
            var widths = [];

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];

                if(item.isGap) {
                    widths.push(item.size *= scale);
                }
                else if(item.isContainer) {
                    widths.push(item.calculateWidth(scale));
                }
                else {
                    widths.push(item.realWidth *= scale);
                }
            }

            this.realWidth = _.max(widths);

            return this.realWidth;
        },

        prepareMeasure: function(origX, y, scale) {
            var self = this;

            var itemCb = function(item, x, y, scale) {
                // Get Y coordinate relative to our own container (Measure)
                var _y = Euterpe.getItemY(self.parentContainer, item, y, scale);

                return item.prepare(origX, _y, scale);
            };

            var contCb = function(item, x, y, scale) {
                return item.prepare(origX, y, scale);
            };

            return this.basePrepare(origX, y, scale, itemCb, contCb);
        }
    });

    return VAlignLeft;
}());
