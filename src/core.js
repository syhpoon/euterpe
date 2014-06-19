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
 * Plugins repository
 *
 * Possible plugins events:
 *
 * init
 * onCalulateWidthNode
 * onCalulateWidthContainer
 * beforePrepareNode - Node is about to be prepared
 * afterPrepareNode - Node has been prepared
 * beforePrepareContainer - Container is about to be prepared
 * afterPrepareContainer - Node has been prepared
 * done
 */
Euterpe.plugins = {
    handlers: [],
    plugins: [],

    add: function(plugin) {
        this.plugins.push(plugin);

        this.setEventHandlers(plugin);
    },

    /**
     * Add event handler
     * @param {Object} event - Event object
     */
    addHandler: function(event) {
        if(!_.isArray(this.handlers[event.event])) {
            this.handlers[event.event] = [];
        }

        this.handlers[event.event].push(event);
    },

    /**
     * Set event handlers for plugin
     * @param {Object} obj
     */
    setEventHandlers: function(obj) {
        var self = this;

        var cmp = function(name) {
            return function(item) {
                return item.name === name;
            }
        };

        if(_.isArray(obj.events)) {
            for(var i=0; i < obj.events.length; i++) {
                obj.events[i].item = obj;
                // Transform string into real function
                obj.events[i].handler = obj[obj.events[i].handler];

                // Replace string filter with function matching item name
                if(typeof obj.events[i].filter === 'string') {
                    obj.events[i].filter = cmp(obj.events[i].filter);
                }
                self.addHandler(obj.events[i]);
            }
        }
    },

    fold: function(eventName, obj) {
        if(_.isArray(this.handlers[eventName])) {
            var r = obj;

            for(var i=0; i < this.handlers[eventName].length; i++) {
                if(r === null) {
                    return r;
                }

                var h = this.handlers[eventName][i];

                if(typeof h.filter === 'undefined' || h.filter.call(h.item, r)) {
                    var args = [r].concat(_.toArray(arguments).slice(2));

                    r = h.handler.apply(h.item, args);
                }
            }

            return r;
        }
        else {
            return obj;
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
    var margins = item.leftMargin + item.rightMargin;

    if(typeof item.realWidth === "number") {
        return item.realWidth + margins;
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

Euterpe.calculateWidth = function(item, scale) {
    var width = 0;

    if(item.isContainer) {
        if(!item.__size_set) {
            item.leftMargin *= scale;
            item.rightMargin *= scale;
            item.__size_set = true;
        }

        if(typeof item.realWidth !== 'undefined') {
            return Euterpe.getRealWidth(item);
        }

        // Possible width calculation override
        if(typeof item.calculateWidth === 'function') {
            item.realWidth = item.calculateWidth(scale);

            return Euterpe.calculateWidth(item, scale);
        }

        // Else first time calculation
        width = 0;

        for(var i=0; i < item.items.length; i++) {
            var itm = item.items[i];

            width += Euterpe.calculateWidth(itm, scale);
        }

        item.realWidth = width;

        return width;
    }
    else {
        if(!item.__size_set) {
            item.realWidth *= scale;
            item.leftMargin *= scale;
            item.rightMargin *= scale;
            item.__size_set = true;
        }

        return Euterpe.getRealWidth(item);
    }
};

// TODO: Come up with better name
Euterpe.getStack = function(item) {
    if(typeof item.parentContainer === 'undefined') {
        return item;
    }
    if(item.parentContainer.isVisual) {
        return item;
    }
    else {
        return Euterpe.getStack(item.parentContainer);
    }
};
