/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

Euterpe.ContainerDepth = 0;

/**
 * Base container superclass
 * @namespace Euterpe
 */
Euterpe.Container = (function() {
    var Container = function(name, config) {
        this.id = Euterpe.randomString(20);
        this.items = [];
        this.name = name;
        this.config = config || {};
        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);
        this.leftItems = [];
        this.rightItems = [];

        // Try to populate items if were defined in config
        if(typeof config !== 'undefined' && _.isArray(config.items)) {
            for(var i=0; i < config.items.length; i++){
                this.add(config.items[i]);
            }
        }
    };

    Container.prototype = {
        getRealWidth: function(scale, exludeMargins) {
            var width = exludeMargins ? 0: Euterpe.getMargins(this, scale);

            for(var i=0; i < this.items.length; i++) {
                width += this.items[i].getRealWidth(scale, exludeMargins);
            }

            return width;
        },

        getRealHeight: function(scale, raw) {
            return Euterpe.getRealHeight(this, this.items, scale, raw);
        },

        isContainer: true,

        /**
         * Clear items
         */
        clear: function() {
            this.items.length = 0;
        },

        /**
         * Get number of items
         *
         * @returns {Number}
         */
        size: function() {
            return this.items.length;
        },

        /**
         * Append an item
         *
         * @param item
         */
        add: function(item) {
            var self = this;

            if(_.isArray(item)) {
                return _.each(item, function(itm) {self.add(itm);});
            }

            item.parent = this;

            this.items.push(item);
        },

        /**
         * Prepend an item
         *
         * @param item
         */
        prepend: function(item) {
            item.parentContainer = this;

            this.items.unshift(item);
        },

        /**
         * Insert an item before another item
         *
         * @param {String} beforeId
         * @param {Object} item
         */
        insertBefore: function(beforeId, item) {
            for(var i=0; i < this.items.length; i++) {
                var cur = this.items[i];

                if(cur.id === beforeId) {
                    return this.items.splice(i, 0, item);
                }
            }
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
            Euterpe.ContainerDepth += 1;

            var acc = [];

            var cb = function(item, x, y, scale, idx) {
                var _y = Euterpe.getY(item, scale, y);
                item.Y = _y;

                return item.render(x, _y, scale, idx);
            };

            itemcb = itemcb || cb;
            containercb = containercb || cb;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];
                var width = 0;

                Euterpe.log.debug(
                    new Array(Euterpe.ContainerDepth).join("  "), item);

                if(item.isContainer) {
                    item.parentContainer = this;

                    width = item.getRealWidth(scale);

                    item.X = x + item.leftMargin * scale;
                    item.Y = y;

                    acc.push(containercb(item, item.X, item.Y, scale, i));

                    x += width;
                }
                else {
                    item.parentContainer = this;

                    width = item.getRealWidth(scale);

                    item.X = x + item.leftMargin * scale;
                    item.Y = y;

                    acc.push(itemcb(item, item.X, item.Y, scale, i));

                    x += width;
                }
            }

            Euterpe.ContainerDepth -= 1;

            return acc;
        },

        render: function(x, y, scale) {
            return Euterpe.baseRender(this.items, x, y, scale);
        }
    };

    return Container;
})();
