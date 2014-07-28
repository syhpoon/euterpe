/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.HBox = (function() {
    /**
     * Simple horizontal box [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} [config.commonY] - Common Y item index
     */
    var HBox = function(config) {
        this.commonY = Euterpe.getConfig(config, "commonY");

        HBox.super.call(this, "Euterpe.HBox", config);
    };

    Euterpe.extend(Euterpe.Container, HBox, {
        render: function(x, y, scale) {
            this.prepared = this.baseRender(x, y, scale);

            return this.prepared;
        }
    });

    return HBox;
}());
