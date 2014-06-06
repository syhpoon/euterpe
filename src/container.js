/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

Euterpe.Container = (function() {
    var Container = function(name, config) {
        this.items = [];
        this.isContainer = true;
        this.defaultGap = 20;
        this.name = name;
        this.config = config;

        // Try to populate items if were defined in config
        if(typeof config !== 'undefined' && _.isArray(config.items)) {
            var gap = this.defaultGap;

            for(var i=0; i < config.items.length; i++){
                var item = config.items[i];

                if(item === null) {
                    gap = null;
                    continue;
                }
                else if(typeof item === 'number') {
                    gap = item;
                    continue;
                }
                else if(item === 'default') {
                    this.addGap(this.defaultGap);
                    continue;
                }

                this.add(config.items[i], gap);

                gap = this.defaultGap;
            }
        }
    };

    Container.prototype = {
        add: function(item, gap) {
            item.parentContainer = this;

            this.addGap(gap);
            this.items.push(item);
        },

        /**
         * Add item to collection without preceding gap
         */
        addNoGap: function(item) {
            this.add(item, null);
        },

        /**
         * Add gap
         * @param {Number | Object} gap
         */
        addGap: function(gap) {
            var _gap;

            if(typeof gap === 'number') {
                _gap = Euterpe.gap(gap);
            }
            else if(typeof gap === 'undefined') {
                _gap = Euterpe.gap(this.defaultGap);
            }
            else {
                _gap = gap;
            }

            if(_gap !== null) {
                this.items.push(_gap);
            }
        },

        /**
         * Recursively calculate width of all items and containers
         *
         * @param {Number} scale - Scale
         */
        calculateWidth: function(scale) {
            var width = 0;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];

                if(item.isGap) {
                    item.size *= scale;

                    width += item.size;
                }
                else if(item.isContainer) {
                    width += item.calculateWidth(scale);
                }
                else {
                    item.realWidth *= scale;

                    width += Euterpe.getRealWidth(item);
                }
            }

            this.realWidth = width;

            return width;
        },

        basePrepare: function(x, y, scale, itemcb, containercb) {
            var acc = [];

            var cb = function(item, x, y, scale) {
                return item.prepare(x, y, scale);
            };

            itemcb = itemcb || cb;
            containercb = containercb || cb;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];

                if(item.isGap) {
                    x += item.size;
                }
                else if(item.isContainer) {
                    acc.push(containercb(item, x, y, scale));

                    x += Euterpe.getRealWidth(item);
                }
                else {
                    acc.push(itemcb(item, x, y, scale));

                    x += Euterpe.getRealWidth(item);
                }
            }

            return acc;
        }
    };

    return Container;
})();
