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
        Euterpe.initContainer(this, "Euterpe.Score", config);
    }

    Score.prototype = {
        /**
         * Recursively pack the container
         *
         * @param {Number} x - Start X coordinate
         * @param {Number} y - Start Y coordinate
         * @param {Number} scale - Scale
         * @param {Kinetic.Layer} layer - Layer to pack into
         */
        pack: function(x, y, scale, layer) {
            this.calculateWidth(scale);

            var objectsToDraw = _.flatten(this.prepare(x, y, scale));

            _.each(objectsToDraw, function(obj) {
                layer.add(obj);
            });

            Euterpe.events.fire("ready");
        },

        prepare: function(x, y, scale) {
            return this.basePrepare(x, y, scale);
        }
    };

    return Score;
}());
