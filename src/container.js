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
         * @param [itemcb]
         * @param [containercb]
         * @returns {Array|null}
         */
        basePrepare: function(x, y, scale, itemcb, containercb) {
            var acc = [];

            var cb = function(item, x, y, scale) {
                return item.prepare(x, y, scale);
            };

            itemcb = itemcb || cb;
            containercb = containercb || cb;

            var objs2show = this.items.length;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];
                var width = 0;

                if(item.isContainer) {
                    var cont = Euterpe.plugins.fold("beforePrepareContainer", item);

                    if(cont === null) {
                        objs2show -= 1;
                        continue;
                    }

                    cont.parentContainer = this;

                    width = Euterpe.calculateWidth(cont, scale);

                    containercb(cont, x + cont.leftMargin, y, scale);

                    var cont2 = Euterpe.plugins.fold("afterPrepareContainer", cont);

                    if(cont2 === null) {
                        objs2show -= 1;
                        continue;
                    }

                    cont2.parentContainer = this;

                    acc.push(cont2);

                    x += width;
                }
                else {
                    var itm = Euterpe.plugins.fold("beforePrepareNode", item);

                    if(itm === null) {
                        objs2show -= 1;
                        continue;
                    }

                    itm.parentContainer = this;

                    width = Euterpe.calculateWidth(itm, scale);

                    var _y = Euterpe.getItemY(this, itm, x + itm.leftMargin,
                                              y, scale);

                    itemcb(itm, x + itm.leftMargin, _y, scale);

                    var itm2 = Euterpe.plugins.fold("afterPrepareNode", itm);

                    if(itm2 === null) {
                        objs2show -= 1;
                        continue;
                    }

                    itm2.parentContainer = this;

                    acc.push(itm2);

                    x += width;
                }
            }

            return objs2show === 0 ? null: acc;
        }
    };

    return Container;
})();
