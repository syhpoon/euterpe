/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

function Euterpe() {}

/** Constants **/
Euterpe.const = {
    LOG_DEBUG: 1,
    LOG_INFO: 2,
    LOG_WARNING: 3,
    LOG_ERROR: 4
};

/** Global configuration **/
Euterpe.global = {
    loglevel: Euterpe.const.LOG_INFO
};

/** Fold plugins **/
Euterpe.foldPlugins = function(plugins, root, scale, extra) {
    return _.reduce(plugins,
                    function(obj, plugin) {
                        return plugin.process(obj, scale, extra);
                    }, root);
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
 * Get object relative Y coordinate
 *
 * @namespace Euterpe
 * @param item
 * @param scale
 * @param y
 * @returns {*}
 */
Euterpe.getY = function(item, scale, y) {
    var location;

    if(typeof item === 'number') {
        location = item;
    }
    else if(typeof item.config !== 'undefined' &&
        typeof item.config.location !== 'undefined') {
        location = item.config.location;
    }
    else {
        return y;
    }

    if(typeof location === 'function') {
        return location(scale, y);
    }

    var offset = Euterpe.global.linePadding / 2 + Euterpe.global.lineWidth / 2;
    var off;

    var d, extra;

    if(location >= 0) {
        d = Math.floor(location);
        extra = Math.ceil(location) > location ? offset: 0;
        off = Euterpe.global.linePadding * d + Euterpe.global.lineWidth * d;

        return (y + off) + extra;
    }
    else if(location < 0) {
        d = Math.ceil(location);
        extra = Math.floor(location) < location ? offset: 0;
        off = Euterpe.global.linePadding * -d + Euterpe.global.lineWidth * -d;

        return (y + off * -1) - extra;
    }

    return y;
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
 * @param {Number} width - Canvas width
 * @param {Number} scale - Scale factor
 * @param {String} containerId - Id of the 'canvas' element
 * @param {Array} plugins - List of plugins to apply
 * @returns {Kinetic.Stage} - Stage object
 */
Euterpe.render = function(root, x, y, width, scale, containerId, plugins) {
    Euterpe.initLog();

    Euterpe.global.root = root;
    Euterpe.global.background = new Kinetic.Layer({});
    Euterpe.global.foreground = new Kinetic.Layer({});
    Euterpe.global.linePadding = 13 * scale;
    Euterpe.global.lineWidth = scale;

    var extra = [];
    var processed = Euterpe.foldPlugins(plugins, root, scale, extra);
    var h = processed.getRealHeight(scale, true);

    y += h[0];

    var totalHeight = y + h[1];

    Euterpe.stage = new Kinetic.Stage({
        container: containerId,
        width: width,
        height: totalHeight
    });

    Euterpe.stage.add(Euterpe.global.foreground);
    Euterpe.stage.add(Euterpe.global.background);

    var rendered = _.flatten(
        processed.render(x + root.leftMargin * scale, y, scale));

    // Render main tree
    for(var i=0; i < rendered.length; i++) {
        if(rendered[i].layer2draw === 'background') {
            Euterpe.global.background.add(rendered[i]);
        }
        else {
            Euterpe.global.foreground.add(rendered[i]);
        }
    }

    // Render extra
    for(var j=0; j < extra.length; j++) {
        var f = extra[j];
        var result = f(processed, scale);

        if(typeof result === 'undefined') {
            continue;
        }
        else if(_.isArray(result)) {
            result = _.flatten(result);
        }
        else {
            result = [result];
        }

        for(i=0; i < result.length; i++) {
            if(result[i].layer2draw === 'background') {
                Euterpe.global.background.add(result[i]);
            }
            else {
                Euterpe.global.foreground.add(result[i]);
            }
        }
    }

    return Euterpe.stage;
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

/**
 * Replace an item with provided id
 *
 * @param {Object} root - Root object
 * @param {String} id - Id of the item to replace
 * @param {Object} obj - Item to replace with
 */
Euterpe.replace = function(root, id, obj) {
    for(var i=0; i < root.items.length; i++) {
        var item = root.items[i];

        if(item.id == id) {
            obj.parentContainer = root;

            root.items[i] = obj;

            return true;
        }

        if(item.isContainer) {
            if(Euterpe.replace(item, id, obj)) {
                break;
            }
        }
    }

    return false;
};

/**
 * Init logging subsystem
 */
Euterpe.initLog = function() {
    var stub = function() {};

    Euterpe.log = {
        debug: stub,
        info: stub,
        warn: stub,
        error: stub
    };

    if(Euterpe.const.LOG_DEBUG >= Euterpe.global.loglevel) {
        if(console.log) {
            Euterpe.log.debug = console.debug.bind(console);
        }
    }

    if(Euterpe.const.LOG_INFO >= Euterpe.global.loglevel) {
        if(console.info) {
            Euterpe.log.info = console.info.bind(console);
        }
    }

    if(Euterpe.const.LOG_WARNING >= Euterpe.global.loglevel) {
        if(console.warn) {
            Euterpe.log.warn = console.warn.bind(console);
        }
    }

    if(Euterpe.const.LOG_ERROR >= Euterpe.global.loglevel) {
        if(console.error) {
            Euterpe.log.error = console.error.bind(console);
        }
    }
};

/**
 * Get distance from the beginning of given container
 */
Euterpe.getDistance = function(container, item, scale) {
    var d = 0;

    for(var i=0; i < container.items.length; i++) {
        var obj = container.items[i];

        if(obj.id === item.id) {
            break;
        }
        else if(obj.isContainer && Euterpe.select("#"+item.id, obj).length > 0) {
            d += obj.leftMargin * scale;
            d += Euterpe.getDistance(obj, item, scale);

            break;
        }
        else {
            d += obj.getRealWidth(scale);
        }
    }

    return d;
};

/**
 * Calculate container real height
 * @param {Object} base - Base container object
 * @param {Array} items - List of items
 * @param {Number} scale
 * @param {Bool} raw
 * @returns {*}
 */
Euterpe.getRealHeight = function(base, items, scale, raw) {
    var baseY = 0;
    var upperY, lowerY, up, low;
    var y;

    if(typeof base.realHeight !== 'undefined') {
        y = Euterpe.getY(base, scale, baseY);

        upperY = base.realHeight[0] * scale;
        lowerY = base.realHeight[1] * scale;
    }

    for(var i=0; i < items.length; i++) {
        var item = items[i];

        var h = item.getRealHeight(scale, true);
        y = Euterpe.getY(item, scale, baseY);

        up = y - h[0];
        low = y + h[1];

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
        return lowerY - upperY;
    }
};

/**
 * Base rendering algorithm
 * @param items
 * @param x
 * @param y
 * @param scale
 * @returns {Array}
 */
Euterpe.baseRender = function(items, x, y, scale) {
    var rendered = [];
    var node;
    var i;

    for(i=0; i < items.length; i++) {
        node = items[i];

        node.X = x;
        node.Y = Euterpe.getY(node, scale, y);

        rendered.push(node.render(node.X, node.Y, scale));

        x += node.getRealWidth(scale);
    }

    return rendered;
};

/**
 * Get list of items groups
 *
 * @param items
 * @returns {Array}
 */
Euterpe.getGroups = function(items) {
    var groups = [];
    var curGroup = null;
    var curGroupType = null;
    var first = null;
    var tmp = [];
    var last = null;

    for(var i=0; i < items.length; i++) {
        var row = items[i];

        if(typeof row.group !== 'undefined') {
            if(curGroup !== row.group) {
                if(curGroup !== null) {
                    groups.push({
                        first: first,
                        last: last,
                        groupType: curGroupType,
                        items: _.clone(tmp)
                    });
                }

                first = row.id;
                curGroup = row.group;
                curGroupType = row.groupType;
                tmp.length = 0;
            }

            tmp.push(row);
        }
        else {
            groups.push({
                first: undefined,
                last: undefined,
                groupType: undefined,
                items: [row]
            });
        }

        last = row.id;
    }

    if(tmp.length > 0) {
        groups.push({
            first: first,
            last: last,
            groupType: curGroupType,
            items: tmp
        });
    }

    return groups;
};

/**
 * Bind events
 *
 * @param {Object} node - Euterpe node
 * @param {Array} rendered - List of rendered assets
 */
Euterpe.bind = function(node, rendered) {
    if(typeof node.config.on === 'undefined') {
        return;
    }

    if(!_.isArray(rendered)) {
        rendered = [rendered];
    }
    else {
        rendered = _.flatten(rendered);
    }

    var state = {};

    var h = function(obj, f) {
        return function() {
            f.call(obj, node, rendered, state);
        };
    };

    var events = _.keys(node.config.on);

    for(var i=0; i < events.length; i++) {
        var event = events[i];

        // Set event on every asset
        _.each(rendered, function(obj) {
            obj.on(event, h(obj, node.config.on[event]));
        });
    }
};
