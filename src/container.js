/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * Base container superclass
 * @namespace Euterpe
 */
Euterpe.Container = (function() {
    var Container = function(name, config) {
        this.items = [];
        this.name = name;
        this.config = config;
        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);

        // Try to populate items if were defined in config
        if(typeof config !== 'undefined' && _.isArray(config.items)) {
            for(var i=0; i < config.items.length; i++){
                this.add(config.items[i]);
            }
        }
    };

    Container.prototype = {
        getRealWidth: function(scale) {
            var width = Euterpe.getMargins(this, scale);

            for(var i=0; i < this.items.length; i++) {
                width += this.items[i].getRealWidth(scale);
            }

            return width;
        },

        isContainer: true,

        add: function(item) {
            item.parentContainer = this;

            this.items.push(item);
        },

        /**
         * Base render method
         * @param x
         * @param y
         * @param scale
         * @param {Function} [itemcb]
         * @param {Function} [containercb]
         * @returns {Array}
         */
        baseRender: function(x, y, scale, itemcb, containercb) {
            var acc = [];
            var self = this;

            var cb = function(item, x, y, scale, idx) {
                var _y = y;

                if(item.isNode) {
                    _y = Euterpe.getItemY(self, item, x + item.leftMargin * scale,
                                          y, scale);
                }

                return item.render(x, _y, scale, idx);
            };

            itemcb = itemcb || cb;
            containercb = containercb || cb;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];
                var width = 0;

                if(item.isContainer) {
                    item.parentContainer = this;

                    width = item.getRealWidth(scale);

                    acc.push(containercb(item, x + item.leftMargin * scale,
                                         y, scale, i));

                    x += width;
                }
                else {
                    item.parentContainer = this;

                    width = item.getRealWidth(scale);

                    acc.push(itemcb(item, x + item.leftMargin * scale,
                                    y, scale, i));

                    x += width;
                }
            }

            return acc;
        },

        render: function(x, y, scale) {
            this.baseRender(x, y, scale);
        }
    };

    return Container;
})();
