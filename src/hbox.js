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
            var self = this;
            var _y;

            var itemCb = function(item, x, y, scale, idx) {
                _y = Euterpe.getItemY(self.parentContainer, item, x, y, scale);
                _y = self.getCommonY(_y, idx);

                return item.render(x, _y, scale);
            };

            var contCb = function(item, x, y, scale, idx) {
                _y = self.getCommonY(y, idx);

                return item.render(x, _y, scale);
            };

            this.prepared = this.baseRender(x, y, scale, itemCb, contCb);

            return this.prepared;
        },

        /** @private **/
        getCommonY: function(y, idx) {
            var _y = y;

            // There is a common Y defined
            if(typeof this.commonY === 'number') {
                if(typeof this._y === 'undefined' && idx === this.commonY) {
                    this._y = _y;
                }
                else if(typeof this._y === 'number') {
                    _y = this._y;
                }
            }

            this.Y = _y;

            return _y;
        }
    });

    return HBox;
}());
