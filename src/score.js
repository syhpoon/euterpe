/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * Top level container
 *
 * @namespace Euterpe
 */
Euterpe.Score = (function() {
    /**
     * Score object
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    function Score(config) {
        this.layer = config.layer;

        Score.super.call(this, "Euterpe.Score", config);
    }

    Euterpe.extend(Euterpe.Container, Score, {
        /**
         * Recursively pack the container
         *
         * @param {Number} x - Start X coordinate
         * @param {Number} y - Start Y coordinate
         * @param {Number} scale - Scale
         */
        prepare: function(x, y, scale) {
            this.flatPack(this.basePrepare(x, y, scale), layer);

            Euterpe.events.fire("ready");
        },

        /** @private */
        flatPack: function(obj, layer) {
            var self = this;

            if(_.isArray(obj)) {
                _.each(obj, function(item) {
                    self.flatPack(item, layer);
                });
            }
            else if(typeof obj.getPrepared === 'function') {
                this.flatPack(obj.getPrepared(), layer);
            }
            else {
                layer.add(obj);
            }
        }
    });

    return Score;
}());
