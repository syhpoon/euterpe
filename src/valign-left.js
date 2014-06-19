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
        console.log(config);
        VAlignLeft.super.call(this, "Euterpe.VAlignLeft", config);
    }

    Euterpe.extend(Euterpe.Container, VAlignLeft, {
        // Override width calculation
        calculateWidth: function(scale) {
            var widths = [];

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];

                if(item.isContainer) {
                    widths.push(Euterpe.calculateWidth(item, scale));
                }
                else {
                    widths.push(item.realWidth *= scale);
                }
            }

            return _.max(widths);
        },

        prepareMeasure: function(origX, y, scale) {

            var itemCb = function(item, x, y, scale) {
                return item.prepare(origX, y, scale);
            };

            var contCb = function(item, x, y, scale) {
                return item.prepare(origX, y, scale);
            };

            this.prepared = this.basePrepare(origX, y, scale, itemCb, contCb);
        },

        getPrepared: function() {
            return this.prepared;
        }
    });

    return VAlignLeft;
}());
