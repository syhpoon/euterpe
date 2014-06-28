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
    var Container = function(name, config, isVisual) {
        this.items = [];
        this.name = name;
        this.config = config;
        this.isVisual = isVisual || false;
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
        isContainer: true,

        add: function(item) {
            item.parentContainer = this;

            this.items.push(item);
        },

        /**
         * Base prepare method
         * @param x
         * @param y
         * @param scale
         * @param {Function} [itemcb]
         * @param {Function} [containercb]
         * @returns {Array|null}
         */
        basePrepare: function(x, y, scale, itemcb, containercb) {
            var state = {
                x: x,
                y: y,
                scale: scale
            };

            var acc = [];
            var self = this;

            var cb = function(item, x, y, scale, idx) {
                var _y = y;

                if(item.isNode) {
                    _y = Euterpe.getItemY(self, item, x + item.leftMargin,
                                          y, scale);
                }

                return item.prepare(x, _y, scale, idx);
            };

            itemcb = itemcb || cb;
            containercb = containercb || cb;

            var skipped = false;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];
                var width = 0;

                if(item.isContainer) {
                    var cont = Euterpe.plugins.fold("beforePrepareContainer",
                                                    item, state);

                    if(cont === null) {
                        skipped = true;
                        continue;
                    }

                    cont.parentContainer = this;

                    width = Euterpe.calculateWidth(cont, scale);

                    if(containercb(cont, state.x + cont.leftMargin, state.y,
                                   state.scale, i) === null) {
                        skipped = true;
                        continue;
                    }

                    var cont2 = Euterpe.plugins.fold("afterPrepareContainer",
                                                     cont, state);

                    if(cont2 === null) {
                        skipped = true;
                        continue;
                    }

                    cont2.parentContainer = this;

                    acc.push(cont2);

                    state.x += width;
                }
                else {
                    var itm = Euterpe.plugins.fold("beforePrepareNode",
                                                   item, state);

                    if(itm === null) {
                        skipped = true;
                        continue;
                    }

                    itm.parentContainer = this;

                    width = Euterpe.calculateWidth(itm, state.scale);

                    if(itemcb(itm, state.x + itm.leftMargin, state.y,
                              state.scale, i) === null) {
                        skipped = true;
                        continue;
                    }

                    var itm2 = Euterpe.plugins.fold("afterPrepareNode", itm,
                                                    state);

                    if(itm2 === null) {
                        skipped = true;
                        continue;
                    }

                    itm2.parentContainer = this;

                    acc.push(itm2);

                    state.x += width;
                }
            }

            if(skipped && !self.isVisual) {
                return null
            }
            else {
                return acc;
            }
        }
    };

    return Container;
})();
