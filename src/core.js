/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

function Euterpe() {}

/**
 * Events repository
 *
 * Possible events:
 *
 * ready - all objects have been prepared for rendering
 */
Euterpe.events = {
    handlers: [],

    /**
     * Add event handler
     * @param {String} event - Event name
     * @param {Function} handler - Handler function
     * @param {Object} node - Node for 'this' pointer
     */
    addHandler: function(event, handler, node) {
        if(!_.isArray(this.handlers[event])) {
            this.handlers[event] = [];
        }

        this.handlers[event].push([node, handler]);
    },

    /**
     * Set event handlers for object (both containers and nodes)
     * @param {Object} obj
     */
    setEventHandlers: function(obj) {
        var self = this;

        // Set event handlers
        if(typeof obj.events === 'object') {
            _.each(_.keys(obj.events),
                function(key) {
                    self.addHandler(key, obj[obj.events[key]], obj);
                });
        }
    },

    /**
     * Fire event
     * @param {String} event - Event name to fire
     */
    fire: function(event) {
        if(_.isArray(this.handlers[event])) {
            _.each(this.handlers[event], function(evt) {
                var node = evt[0];
                var handler = evt[1];

                handler.apply(node);
            });
        }
    }
};

/**
 * Get the object value by key or default if undefined
 *
 * @namespace Euterpe
 * @param {Object} config
 * @param {String} name
 * @param {*} defaultVal
 * @returns {*}
 */
Euterpe.get_config = function(config, name, defaultVal) {
    if(typeof config === 'undefined')
        return defaultVal;

    return typeof config[name] === 'undefined' ? defaultVal : config[name];
};

/**
 * Create a gap object
 *
 * @namespace Euterpe
 * @param {Number} size - Gap size in pixels
 * @param {String} [direction='horizontal'] - Gap direction (horizontal | vertical)
 * @returns {Object}
 */
Euterpe.gap = function(size, direction) {
    return {
        size: size,
        vertical: direction === 'vertical',
        isGap: true
    };
};

/**
 * Init node object
 *
 * @param {Object} node - Node to init
 * @param {String} name - Node name
 */
Euterpe.initNode = function(node, name) {
    node.isNode = true;
    node.nodeName = name;

    Euterpe.events.setEventHandlers(node);
};


/**
 * Init a container object
 *
 * @namespace Euterpe
 * @param {Object} obj - Object to init
 */
Euterpe.initContainer = function(obj) {
    obj.isContainer = true;
    obj.defaultGap = 20;
    obj.items = [];

    Euterpe.events.setEventHandlers(obj);

    /**
     * Add item to container
     *
     * @param {Object} item - Item
     * @param {Number|Object} [gap=Packer.defaultGap] gap - Horizontal gap before the item
     */
    obj.add = function(item, gap) {
        item.parentContainer = this;

        this.addGap(gap);
        this.items.push(item);
    };

    /**
     * Add item to collection without preceding gap
     */
    obj.addNoGap = function(item) {
        this.add(item, null);
    };

    /**
     * Add gap
     * @param {Number | Object} gap
     */
    obj.addGap = function(gap) {
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
    };

    if(typeof obj.__proto__.calculateWidth === 'undefined') {
        /**
         * Recursively calculate width of all items and containers
         *
         * @param {Number} scale - Scale
         */
        obj.calculateWidth = function(scale) {
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
        };
    }

    obj.basePrepare = function(x, y, scale, itemcb, containercb) {
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
    };
};

/**
 * Get real width of the object
 *
 * @namespace Euterpe
 * @param {Object} item - Item
 * @returns {Number}
 */
Euterpe.getRealWidth = function(item) {
    if(typeof item.realWidth === "number") {
        return item.realWidth;
    }
    else if(typeof item.width === "function") {
        return item.width();
    }
    else {
        return 0;
    }
};
