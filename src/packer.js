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
Euterpe.Packer = (function() {
    /**
     * Packer object
     *
     * @constructor
     */
    function Packer() {
        Euterpe.initContainer(this);
    }

    Packer.prototype = {
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
        },

        prepare: function(x, y, scale) {
            return this.basePrepare(x, y, scale);
        }
    };

    return Packer;
}());
