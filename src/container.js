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
        this.id = Euterpe.randomString(20);
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
        getRealWidth: function(scale, exludeMargins) {
            var width = exludeMargins ? 0: Euterpe.getMargins(this, scale);

            for(var i=0; i < this.items.length; i++) {
                width += this.items[i].getRealWidth(scale, exludeMargins);
            }

            return width;
        },

        getRealHeight: function(scale, raw) {
            var baseY = 0;

            var collectCoords = function(item, acc) {

                if(typeof item.realHeight !== 'undefined') {
                    var y = Euterpe.getY(item, scale, baseY);

                    if(Euterpe.isModifier(item.modifier)) {
                        var mod = item.modifier;

                        if(Euterpe.isModifierOfType(mod, "y", "relative")) {
                            baseY += Euterpe.getModifierValue(mod, "y");
                        }
                        else if(Euterpe.isModifierOfType(mod, "y", "absolute")) {
                            baseY = Euterpe.getModifierValue(mod, "y");
                        }
                    }

                    acc.push([y - item.realHeight[0] * scale,
                              y + item.realHeight[1] * scale]);
                }

                if(item.isContainer) {
                    _.each(item.items,
                        function(itm) { collectCoords(itm, acc); });
                }
            };

            var coords = [];
            var upperY, lowerY, up, low;

            collectCoords(this, coords);

            for(var i=0; i < coords.length; i++) {
                up = coords[i][0];
                low = coords[i][1];

                if(typeof upperY === 'undefined' || up < upperY) {
                    upperY = up;
                }

                if(typeof lowerY === 'undefined' || low > lowerY) {
                    lowerY = low;
                }
            }

            if(raw) {
                return [upperY * -1, lowerY];
            }
            else {
                return Math.abs(upperY - lowerY);
            }
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
            var state = {
                x: x,
                y: y,
                scale: scale
            };

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

                // Check if item contains any modifiers
                if(Euterpe.isModifier(item.modifier)) {
                    var mod = item.modifier;

                    if(Euterpe.isModifierOfType(mod, "y", "relative")) {
                        y += Euterpe.getModifierValue(mod, "y");
                    }
                    else if(Euterpe.isModifierOfType(mod, "y", "absolute")) {
                        y = Euterpe.getModifierValue(mod, "y");
                    }
                }

                if(typeof item === 'function') {
                    item(state);

                    x = state.x;
                }
                else if(item.isContainer) {
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

            return acc;
        },

        render: function(x, y, scale) {
            this.baseRender(x, y, scale);
        }
    };

    return Container;
})();
