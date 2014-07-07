/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

function Euterpe() {}

/** Global configuration **/
Euterpe.global = {};

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
 */
Euterpe.plugins = {
    plugins: [],

    add: function(plugin) {
        this.plugins.push(plugin);
    },

    fold: function(root, scale) {
        return _.reduce(this.plugins,
            function(obj, plugin) {
                return plugin.process(obj, scale);
            }, root);
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
 * Poor man inheritance
 *
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

/**
 * Main render function
 *
 * @param {Object} root - Root item
 * @param {Number} x - X coordinate
 * @param {Number} y - Y coordinate
 * @param {Number} scale - Scale factor
 * @param layer
 */
Euterpe.render = function(root, x, y, scale, layer) {
    Euterpe.global.root = root;

    var processed = Euterpe.plugins.fold(root, scale);

    var rendered = _.flatten(
        processed.baseRender(x + root.leftMargin * scale, y, scale));

    for(var i=0; i < rendered.length; i++) {
        layer.add(rendered[i]);
    }

    Euterpe.events.fire("ready");
};

/**
 * Calculate the size of item margins
 *
 * @param item
 * @param scale
 * @returns {Number}
 */
Euterpe.getMargins = function(item, scale) {
    return item.leftMargin * scale + item.rightMargin * scale;
};

/**
 * Generate random string
 * From http://stackoverflow.com/a/19964557
 *
 * @param len
 * @returns {string}
 */
Euterpe.randomString = function(len) {
    return new Array(len + 1).join(
        (Math.random().toString(36) + '00000000000000000')
            .slice(2, 18)).slice(0, len);
};

/**
 * Select items
 * Selector format: #<ID> or <NAME>
 *
 * @param {String} selector - Selector string
 * @param {Object} [root] - Root object
 */
Euterpe.select = function(selector, root) {
    var f = function(obj) {
        // Compare by id
        if(selector[0] === '#') {
            return obj.id === selector.slice(1, selector.length);
        }
        // Compare by name
        else {
            return obj.name === selector;
        }
    };

    root = root || Euterpe.global.root;

    var r = [];

    if(root.isNode && f(root)) {
        r.push(root);
    }
    else if(root.isContainer) {
        for(var i=0; i < root.items.length; i++) {
            var item = root.items[i];

            if(f(item)) {
                r.push(item);
            }

            if(item.isContainer) {
                r.push(Euterpe.select(selector, item));
            }
        }
    }

    return _.flatten(r);
};

