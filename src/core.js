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
Euterpe.getConfig = function(config, name, defaultVal) {
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
 * Try to get item location based on container type and location definition
 */
Euterpe.getItemY = function(container, item, x, y, scale) {
    if(typeof item.location === 'object' &&
       typeof item.location[container.name] === 'object') {
        return container.getItemY(item, item.location[container.name], x, y, scale);
    }
    else if(typeof container.parentContainer !== 'undefined') {
        return Euterpe.getItemY(container.parentContainer, item, x, y, scale);
    }
    else {
        return y;
    }
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

/**
 * Poor man inheritance
 * @param base
 * @param sub
 * @param {Object} [extend]
 */
Euterpe.extend = function(base, sub, extend) {
    function Inheritance() {}
    Inheritance.prototype = base.prototype;
    sub.prototype = new Inheritance();

    sub.prototype.constructor = sub;
    sub.super = base;

    if(typeof extend === 'object') {
        _.extend(sub.prototype, extend);
    }
};

