/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.VBox = (function() {
    /**
     * Left vertical align [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    function VBox(config) {
        VBox.super.call(this, "Euterpe.VBox", config);
    }

    Euterpe.extend(Euterpe.Container, VBox, {
        // Override width calculation
        getRealWidth: function(scale, excludeMargins) {
            var margins = Euterpe.getMargins(this, scale);

            return _.max(
                _.map(this.items,
                    function(item) {
                        return item.getRealWidth(scale, excludeMargins);
                    })
            ) + (excludeMargins ? 0: margins);
        },

        render: function(origX, y, scale) {
            var self = this;

            var itemCb = function(item, x, y, scale) {
                // Get Y coordinate relative to our own container (Measure)
                var _y = Euterpe.getItemY(self.parentContainer, item,
                                          origX, y, scale);

                item.Y = _y;

                return item.render(origX, _y, scale);
            };

            var contCb = function(item, x, y, scale) {
                return item.render(origX, y, scale);
            };

            this.prepared = this.baseRender(origX, y, scale, itemCb, contCb);

            return this.prepared;
        }
    });

    return VBox;
}());
