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
        this.name = this.name || name;
        this.config = config || {};
        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);
        this.leftItems = [];
        this.rightItems = [];
        this.bottomHeight = {};
        this.topItems = {};
        this.topHeight = {};
        this.bottomItems = {};

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
            var itemsH = Euterpe.getRealHeight(this, this.items, scale, raw);

            var topH = _.reduce(this.topHeight,
                                function(acc, h) {return acc + h}, 0) * scale;

            var bottomH = _.reduce(this.bottomHeight,
                                function(acc, h) {return acc + h}, 0) * scale;

            if(raw) {
                return [itemsH[0] + topH, itemsH[1] + bottomH];
            } else {
                return itemsH + topH + bottomH;
            }
        },

        isContainer: true,

        /**
         * Get the maximum width of the left items
         * @param scale
         */
        getLeftWidth: function(scale) {
            var ws = _.map(this.items, function(obj) {
                return obj.getLeftWidth(scale);
            });

            return _.max(ws);
        },

        /**
         * Get the maximum width of the right items
         * @param scale
         */
        getRightWidth: function(scale) {
            var ws = _.map(this.items, function(obj) {
                return obj.getRightWidth(scale);
            });

            return _.max(ws);
        },

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
            item.parent = this;

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

                item.parent = this;

                width = item.getRealWidth(scale);

                item.X = x + item.leftMargin * scale;
                item.Y = y;

                if(item.isContainer) {
                    acc.push(containercb(item, item.X, item.Y, scale, i));
                }
                else {
                    acc.push(itemcb(item, item.X, item.Y, scale, i));
                }

                x += width;
            }

            Euterpe.ContainerDepth -= 1;

            return acc;
        },

        render: function(x, y, scale) {
            return Euterpe.baseRender(this.items, x, y, scale);
        },

        renderOob: function(x, y, scale) {
            var rendered = [];

            var h = this.getRealHeight(scale, true);
            var top = this.doRenderOob(x, y - h[0], scale,
                                       this.topItems,
                                       this.topHeight);
            var bottom = this.doRenderOob(x, y + h[1], scale,
                                          this.bottomItems,
                                          this.bottomHeight);

            Array.prototype.push.apply(rendered, top);
            Array.prototype.push.apply(rendered, bottom);

            return rendered;
        },

        /** @private */
        doRenderOob: function(x, y, scale, xItems, xHeight) {
            var self = this;
            var rendered = [];
            var level = 0;

            while(typeof(xItems[level]) !== 'undefined') {
                var items = xItems[level];

                var r = _.map(items, function(obj) {
                    return obj.render(x, y, scale, self);
                });

                Array.prototype.push.apply(rendered, _.flatten(r));

                y += xHeight[level++] * scale;
            }

            return rendered;
        },

        /**
         * Add item to the top area
         * @param oob Oob node
         */
        addTopOob: function(oob) {
            this._addOob(oob, this.topItems, this.topHeight);
        },

        /**
         * Add item to the bottom area
         * @param oob Oob node
         */
        addBottomOob: function(oob) {
            this._addOob(oob, this.bottomItems, this.bottomHeight);
        },

        /** @private */
        _addOob: function(obj, xItems, xHeight) {
            // Find a place for the item
            var level = 0;

            while(true) {
                var items = xItems[level];

                if(typeof items === 'undefined') {
                    xItems[level] = [obj];
                    xHeight[level] = obj.height;

                    break;
                } else {
                    var fit = true;

                    for(var i=0; i < items.length; i++) {
                        var item = items[i];
                        var objLen = obj.endX - obj.startX;
                        var itemLen = item.endX - item.startX;
                        var smaller, bigger;

                        if(objLen < itemLen) {
                            smaller = obj;
                            bigger = item;
                        } else {
                            smaller = item;
                            bigger = obj;
                        }

                        if(!(smaller.endX < bigger.startX ||
                             smaller.startX > bigger.endX)) {
                            fit = false;
                            break;
                        }
                    }

                    if(!fit) {
                        level += 1;
                    } else {
                        items.push(obj);

                        if(obj.height > xHeight[level]) {
                           xHeight[level] = obj.height;
                        }

                        break;
                    }
                }
            }
        }
    };

    return Container;
})();
