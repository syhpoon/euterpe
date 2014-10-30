/**
 * @license
 * Euterpe.js version 0.1
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */
function Euterpe() {}

Euterpe.const = {
    LOG_DEBUG: 1,
    LOG_INFO: 2,
    LOG_WARNING: 3,
    LOG_ERROR: 4
};

Euterpe.global = {
    loglevel: Euterpe.const.LOG_INFO
};

Euterpe.plugins = {
    plugins: [],
    add: function() {
        var self = this;
        _.each(arguments, function(plugin) {
            self.plugins.push(plugin);
        });
    },
    fold: function(root, scale, extra) {
        return _.reduce(this.plugins, function(obj, plugin) {
            return plugin.process(obj, scale, extra);
        }, root);
    }
};

Euterpe.getConfig = function(config, name, defaultVal) {
    if (typeof config === "undefined") return defaultVal;
    return typeof config[name] === "undefined" ? defaultVal : config[name];
};

Euterpe.getY = function(item, scale, y) {
    var location;
    if (typeof item === "number") {
        location = item;
    } else if (typeof item.config !== "undefined" && typeof item.config.location !== "undefined") {
        location = item.config.location;
    } else {
        return y;
    }
    if (typeof location === "function") {
        return location(scale, y);
    }
    var offset = Euterpe.global.linePadding / 2 + Euterpe.global.lineWidth / 2;
    var off;
    var d, extra;
    if (location >= 0) {
        d = Math.floor(location);
        extra = Math.ceil(location) > location ? offset : 0;
        off = Euterpe.global.linePadding * d + Euterpe.global.lineWidth * d;
        return y + off + extra;
    } else if (location < 0) {
        d = Math.ceil(location);
        extra = Math.floor(location) < location ? offset : 0;
        off = Euterpe.global.linePadding * -d + Euterpe.global.lineWidth * -d;
        return y + off * -1 - extra;
    }
    return y;
};

Euterpe.initNode = function(node, name) {
    node.isNode = true;
    node.nodeName = name;
};

Euterpe.extend = function(base, sub, extend) {
    function Inheritance() {}
    Inheritance.prototype = base.prototype;
    sub.prototype = new Inheritance();
    sub.prototype.constructor = sub;
    sub.super = base;
    if (typeof extend === "object") {
        _.extend(sub.prototype, extend);
    }
};

Euterpe.render = function(root, x, y, width, scale, containerId) {
    Euterpe.initLog();
    Euterpe.global.root = root;
    Euterpe.global.background = new Kinetic.Layer({});
    Euterpe.global.foreground = new Kinetic.Layer({});
    Euterpe.global.linePadding = 13 * scale;
    Euterpe.global.lineWidth = scale;
    var extra = [];
    var processed = Euterpe.plugins.fold(root, scale, extra);
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
    var rendered = _.flatten(processed.render(x + root.leftMargin * scale, y, scale));
    for (var i = 0; i < rendered.length; i++) {
        if (rendered[i].layer2draw === "background") {
            Euterpe.global.background.add(rendered[i]);
        } else {
            Euterpe.global.foreground.add(rendered[i]);
        }
    }
    for (var j = 0; j < extra.length; j++) {
        var f = extra[j];
        var result = f(processed, scale);
        if (typeof result === "undefined") {
            continue;
        } else if (_.isArray(result)) {
            result = _.flatten(result);
        } else {
            result = [ result ];
        }
        for (i = 0; i < result.length; i++) {
            if (result[i].layer2draw === "background") {
                Euterpe.global.background.add(result[i]);
            } else {
                Euterpe.global.foreground.add(result[i]);
            }
        }
    }
    return Euterpe.stage;
};

Euterpe.getMargins = function(item, scale) {
    return item.leftMargin * scale + item.rightMargin * scale;
};

Euterpe.randomString = function(len) {
    return new Array(len + 1).join((Math.random().toString(36) + "00000000000000000").slice(2, 18)).slice(0, len);
};

Euterpe.select = function(selector, root) {
    var f = function(obj) {
        if (selector[0] === "#") {
            return obj.id === selector.slice(1, selector.length);
        } else {
            return obj.name === selector;
        }
    };
    root = root || Euterpe.global.root;
    var r = [];
    if (root.isNode && f(root)) {
        r.push(root);
    } else if (root.isContainer) {
        for (var i = 0; i < root.items.length; i++) {
            var item = root.items[i];
            if (f(item)) {
                r.push(item);
            }
            if (item.isContainer) {
                r.push(Euterpe.select(selector, item));
            }
        }
    }
    return _.flatten(r);
};

Euterpe.replace = function(root, id, obj) {
    for (var i = 0; i < root.items.length; i++) {
        var item = root.items[i];
        if (item.id == id) {
            obj.parentContainer = root;
            root.items[i] = obj;
            return true;
        }
        if (item.isContainer) {
            if (Euterpe.replace(item, id, obj)) {
                break;
            }
        }
    }
    return false;
};

Euterpe.initLog = function() {
    var console = window.console || {};
    var stub = function() {};
    Euterpe.log = {
        debug: stub,
        info: stub,
        warn: stub,
        error: stub
    };
    if (Euterpe.const.LOG_DEBUG >= Euterpe.global.loglevel) {
        if (console.log) {
            Euterpe.log.debug = console.debug.bind(console);
        }
    }
    if (Euterpe.const.LOG_INFO >= Euterpe.global.loglevel) {
        if (console.info) {
            Euterpe.log.info = console.info.bind(console);
        }
    }
    if (Euterpe.const.LOG_WARNING >= Euterpe.global.loglevel) {
        if (console.warn) {
            Euterpe.log.warn = console.warn.bind(console);
        }
    }
    if (Euterpe.const.LOG_ERROR >= Euterpe.global.loglevel) {
        if (console.error) {
            Euterpe.log.error = console.error.bind(console);
        }
    }
};

Euterpe.getDistance = function(container, item, scale) {
    var d = 0;
    for (var i = 0; i < container.items.length; i++) {
        var obj = container.items[i];
        if (obj.id === item.id) {
            break;
        } else if (obj.isContainer && Euterpe.select("#" + item.id, obj).length > 0) {
            d += obj.leftMargin * scale;
            d += Euterpe.getDistance(obj, item, scale);
            break;
        } else {
            d += obj.getRealWidth(scale);
        }
    }
    return d;
};

Euterpe.getRealHeight = function(base, items, scale, raw) {
    var baseY = 0;
    var upperY, lowerY, up, low;
    var y;
    if (typeof base.realHeight !== "undefined") {
        y = Euterpe.getY(base, scale, baseY);
        upperY = base.realHeight[0] * scale;
        lowerY = base.realHeight[1] * scale;
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var h = item.getRealHeight(scale, true);
        y = Euterpe.getY(item, scale, baseY);
        up = y - h[0];
        low = y + h[1];
        if (typeof upperY === "undefined" || up < upperY) {
            upperY = up;
        }
        if (typeof lowerY === "undefined" || low > lowerY) {
            lowerY = low;
        }
    }
    if (raw) {
        return [ upperY * -1, lowerY ];
    } else {
        return lowerY - upperY;
    }
};

Euterpe.baseRender = function(items, x, y, scale) {
    var rendered = [];
    var node;
    var i;
    for (i = 0; i < items.length; i++) {
        node = items[i];
        node.X = x;
        node.Y = Euterpe.getY(node, scale, y);
        rendered.push(node.render(node.X, node.Y, scale));
        x += node.getRealWidth(scale);
    }
    return rendered;
};

Euterpe.getGroups = function(items) {
    var groups = [];
    var curGroup = null;
    var curGroupType = null;
    var first = null;
    var tmp = [];
    var last = null;
    for (var i = 0; i < items.length; i++) {
        var row = items[i];
        if (typeof row.group !== "undefined") {
            if (curGroup !== row.group) {
                if (curGroup !== null) {
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
        } else {
            groups.push({
                first: undefined,
                last: undefined,
                groupType: undefined,
                items: [ row ]
            });
        }
        last = row.id;
    }
    if (tmp.length > 0) {
        groups.push({
            first: first,
            last: last,
            groupType: curGroupType,
            items: tmp
        });
    }
    return groups;
};

Euterpe.bind = function(node, rendered) {
    if (typeof node.config.on === "undefined") {
        return;
    }
    if (!_.isArray(rendered)) {
        rendered = [ rendered ];
    } else {
        rendered = _.flatten(rendered);
    }
    var state = {};
    var h = function(obj, f) {
        return function() {
            f.call(obj, node, rendered, state);
        };
    };
    var events = _.keys(node.config.on);
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        _.each(rendered, function(obj) {
            obj.on(event, h(obj, node.config.on[event]));
        });
    }
};

Euterpe.ContainerDepth = 0;

Euterpe.Container = function() {
    var Container = function(name, config) {
        this.id = Euterpe.randomString(20);
        this.items = [];
        this.name = this.name || name;
        this.config = config || {};
        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);
        this.leftItems = [];
        this.rightItems = [];
        if (typeof config !== "undefined" && _.isArray(config.items)) {
            for (var i = 0; i < config.items.length; i++) {
                this.add(config.items[i]);
            }
        }
    };
    Container.prototype = {
        getRealWidth: function(scale, exludeMargins) {
            var width = exludeMargins ? 0 : Euterpe.getMargins(this, scale);
            for (var i = 0; i < this.items.length; i++) {
                width += this.items[i].getRealWidth(scale, exludeMargins);
            }
            return width;
        },
        getRealHeight: function(scale, raw) {
            return Euterpe.getRealHeight(this, this.items, scale, raw);
        },
        isContainer: true,
        getLeftWidth: function(scale) {
            var ws = _.map(this.items, function(obj) {
                return obj.getLeftWidth(scale);
            });
            return _.max(ws);
        },
        getRightWidth: function(scale) {
            var ws = _.map(this.items, function(obj) {
                return obj.getRightWidth(scale);
            });
            return _.max(ws);
        },
        clear: function() {
            this.items.length = 0;
        },
        size: function() {
            return this.items.length;
        },
        add: function(item) {
            var self = this;
            if (_.isArray(item)) {
                return _.each(item, function(itm) {
                    self.add(itm);
                });
            }
            item.parent = this;
            this.items.push(item);
        },
        prepend: function(item) {
            item.parentContainer = this;
            this.items.unshift(item);
        },
        insertBefore: function(beforeId, item) {
            for (var i = 0; i < this.items.length; i++) {
                var cur = this.items[i];
                if (cur.id === beforeId) {
                    return this.items.splice(i, 0, item);
                }
            }
        },
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
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var width = 0;
                Euterpe.log.debug(new Array(Euterpe.ContainerDepth).join("  "), item);
                if (item.isContainer) {
                    item.parentContainer = this;
                    width = item.getRealWidth(scale);
                    item.X = x + item.leftMargin * scale;
                    item.Y = y;
                    acc.push(containercb(item, item.X, item.Y, scale, i));
                    x += width;
                } else {
                    item.parentContainer = this;
                    width = item.getRealWidth(scale);
                    item.X = x + item.leftMargin * scale;
                    item.Y = y;
                    acc.push(itemcb(item, item.X, item.Y, scale, i));
                    x += width;
                }
            }
            Euterpe.ContainerDepth -= 1;
            return acc;
        },
        render: function(x, y, scale) {
            return Euterpe.baseRender(this.items, x, y, scale);
        }
    };
    return Container;
}();

Euterpe.Node = function() {
    var Node = function(name, config) {
        this.id = Euterpe.randomString(20);
        this.name = name;
        this.config = config || {};
        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);
        this.leftItems = Euterpe.getConfig(config, "leftItems", []);
        this.rightItems = Euterpe.getConfig(config, "rightItems", []);
    };
    Node.prototype.isNode = true;
    Node.prototype.getLeftWidth = function(scale) {
        return this.reduceWidth(this.leftItems, scale);
    };
    Node.prototype.getRightWidth = function(scale) {
        return this.reduceWidth(this.rightItems, scale);
    };
    Node.prototype.getRealWidth = function(scale, bare) {
        var margins = Euterpe.getMargins(this, scale);
        return this.realWidth * scale + (bare ? 0 : margins);
    };
    Node.prototype.getRealHeight = function(scale, raw) {
        if (typeof this.realHeight === "undefined") {
            return raw ? [ 0, 0 ] : 0;
        } else if (raw) {
            return [ this.realHeight[0] * scale, this.realHeight[1] * scale ];
        } else {
            return this.realHeight[0] * scale + this.realHeight[1] * scale;
        }
    };
    Node.prototype.clone = function() {
        var cloned = new this.constructor(this.config);
        cloned.parentContainer = this.parentContainer;
        return cloned;
    };
    Node.prototype.reduceWidth = function(list, scale) {
        return _.reduce(list, function(acc, x) {
            return acc + x.getRealWidth(scale);
        }, 0);
    };
    return Node;
}();

Euterpe.Row = function() {
    function Row(config) {
        Row.super.call(this, "Euterpe.Row", config);
        this.type = Euterpe.getConfig(config, "type");
        this.group = Euterpe.getConfig(config, "group", undefined);
        this.groupType = Euterpe.getConfig(config, "groupType", undefined);
        if (this.type === "measure") {
            this.numberOfLines = 5;
            this.realHeight = [ 0, 57.3 ];
        } else if (this.type === "tab") {
            this.numberOfLines = 6;
            this.realHeight = [ 0, 71.5 ];
        }
        this.prepared = [];
    }
    Euterpe.extend(Euterpe.Container, Row, {
        render: function(x, y, scale) {
            var rendered = [];
            var totalWidth = 0;
            var origX = x;
            for (var i = 0; i < this.items.length; i++) {
                var column = this.items[i];
                column.X = x + column.leftMargin * scale;
                column.Y = y;
                rendered.push(column.render(column.X, column.Y, scale));
                var w = column.getRealWidth(scale);
                totalWidth += w;
                x += w;
            }
            rendered.push(this.renderSelf(origX, y, scale, totalWidth));
            if (this.type === "measure") {
                var lines = [];
                this.prepareLedgerLines(lines, Euterpe.select("Euterpe.Note", this), y, scale);
                rendered.push(this.renderLedgerLines(lines, scale));
            }
            return rendered;
        },
        prepareLedgerLines: function(lines, notes, y, scale) {
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                if (typeof note.config.location === "number") {
                    var width = note.headWidth * scale;
                    var d;
                    if (note.config.location > this.numberOfLines - 1) {
                        d = Math.floor(note.config.location);
                        this.addLedgerLine(note, d, note.X, width, y, lines, scale);
                    } else if (note.config.location < 0) {
                        d = Math.ceil(note.config.location);
                        this.addLedgerLine(note, d, note.X, width, y, lines, scale);
                    }
                }
            }
        },
        addLedgerLine: function(item, pos, x, width, baseY, lines, scale) {
            var found;
            while (true) {
                if (pos > 0 && pos <= 4 || pos === 0) {
                    break;
                }
                found = false;
                var _y = Euterpe.getY(pos, scale, baseY);
                if (item.name === "Euterpe.Note") {
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        if (line[0] === x && line[1] === _y) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        lines.push([ x, _y, width ]);
                    }
                }
                pos += pos > 0 ? -1 : 1;
            }
        },
        renderLedgerLines: function(lines, scale) {
            var r = [];
            for (var i = 0; i < lines.length; i++) {
                var x = lines[i][0];
                var y = lines[i][1];
                var shift = 5 * scale;
                var width = lines[i][2] + shift * 2;
                r.push(new Kinetic.Line({
                    points: [ 0, 0, width, 0 ],
                    stroke: "black",
                    strokeWidth: Euterpe.global.lineWidth,
                    x: x - shift,
                    y: y
                }));
            }
            return r;
        },
        renderSelf: function(x, y, scale, width) {
            var line1 = new Kinetic.Line({
                points: [ 0, 0, width, 0 ],
                stroke: "black",
                strokeWidth: Euterpe.global.lineWidth,
                x: x,
                y: y
            });
            var rendered = new Kinetic.Group({});
            rendered.add(line1);
            for (var i = 2; i < this.numberOfLines + 1; i++) {
                var _y = Euterpe.getY(i - 1, scale, y);
                var line = line1.clone({
                    y: _y
                });
                rendered.add(line);
            }
            return rendered;
        }
    });
    return Row;
}();

Euterpe.Column = function() {
    function Column(config) {
        Column.super.call(this, "Euterpe.Column", config);
    }
    Euterpe.extend(Euterpe.Container, Column, {
        getRealWidth: function(scale, bare) {
            var margins = Euterpe.getMargins(this, scale);
            var items = this.collectItems();
            var w = _.max(_.map(items, function(item) {
                var left = 0;
                var right = 0;
                if (item.isNode) {
                    left = item.getLeftWidth(scale);
                    right = item.getRightWidth(scale);
                }
                return item.getRealWidth(scale, bare) + (bare ? 0 : left + right);
            }));
            return w + (bare ? 0 : margins);
        },
        getRealHeight: function(scale, raw) {
            var items = this.collectItems();
            return Euterpe.getRealHeight(this, items, scale, raw);
        },
        collectItems: function() {
            var items = this.items;
            if (_.isArray(this.config.aboveItems)) {
                items = this.config.aboveItems.concat(this.items);
            }
            if (_.isArray(this.config.belowItems)) {
                items = items.concat(this.config.belowItems);
            }
            return items;
        },
        render: function(x, y, scale) {
            var rendered = [];
            var node;
            var i;
            var maxw = 0;
            var items = this.collectItems();
            var w = this.renderSideItems(items, scale, rendered, x, y, true);
            x += w;
            for (i = 0; i < items.length; i++) {
                node = items[i];
                node.X = x;
                node.Y = Euterpe.getY(node, scale, y);
                rendered.push(node.render(node.X, node.Y, scale));
                w = node.getRealWidth(scale);
                if (w > maxw) {
                    maxw = w;
                }
            }
            this.renderSideItems(this.items, scale, rendered, x + maxw, y, false);
            return rendered;
        },
        renderSideItems: function(items, scale, rendered, x, y, isLeft) {
            var ws = [];
            var maxw = 0;
            var lw = 0;
            if (isLeft) {
                for (i = 0; i < items.length; i++) {
                    if (items[i].isNode) {
                        w = items[i].getLeftWidth(scale);
                        ws.push(w);
                        if (w > maxw) {
                            maxw = w;
                        }
                    } else {
                        ws.push(0);
                    }
                }
            }
            for (var i = 0; i < items.length; i++) {
                var node = items[i];
                var w = 0;
                var offset = 0;
                if (typeof ws[i] !== "undefined" && ws[i] !== maxw) {
                    offset = maxw - ws[i];
                }
                var side = isLeft ? node.leftItems : node.rightItems;
                for (var l = 0; l < side.length; l++) {
                    var obj = side[l];
                    if (typeof obj.config.location === "undefined") {
                        obj.config.location = node.config.location;
                    }
                    obj.X = x + obj.leftMargin * scale + offset + w;
                    obj.Y = Euterpe.getY(obj, scale, y);
                    rendered.push(obj.render(obj.X, obj.Y, scale));
                    w += obj.getRealWidth(scale);
                }
                if (w > lw) {
                    lw = w;
                }
            }
            return lw;
        },
        reduceWidth: function(list, scale) {
            return _.reduce(list, function(acc, x) {
                return acc + x.getRealWidth(scale);
            }, 0);
        }
    });
    return Column;
}();

Euterpe.Bar = function() {
    function Bar(config) {
        this.leftType = Euterpe.getConfig(config, "leftType", "none");
        this.rightType = Euterpe.getConfig(config, "rightType", "none");
        this.number = Euterpe.getConfig(config, "number", undefined);
        this.numberOffset = 0;
        this.numberHeight = [ 0, 0 ];
        if (typeof this.number !== "undefined") {
            this.numberItem = new Euterpe.Text({
                text: this.number.toString()
            });
            this.numberOffset = 3;
            this.numberHeight = this.numberItem.getRealHeight(1, true);
        }
        this.leftWidth = this.widths[this.leftType];
        this.rightWidth = this.widths[this.rightType];
        this.realWidth = this.leftWidth + this.rightWidth;
        Bar.super.call(this, "Euterpe.Bar", config);
    }
    Euterpe.extend(Euterpe.Node, Bar, {
        widths: {
            none: 0,
            single: 2,
            "double": 7,
            "double bold": 13,
            repeat: 24
        },
        getRealHeight: function(scale, raw) {
            if (typeof this.realHeight === "undefined") {
                this.realHeight = _.clone(this.parent.realHeight);
                this.realHeight[0] += this.numberHeight[0] + this.numberHeight[1];
                this.realHeight[0] += this.numberOffset;
            }
            return Euterpe.Node.prototype.getRealHeight.call(this, scale, raw);
        },
        render: function(x, y, scale) {
            var rendered = [];
            var top = Euterpe.getY(0, scale, y);
            var barY = top - Euterpe.global.lineWidth / 2;
            if (this.leftWidth > 0) {
                rendered.push(this.initBar(this.leftType, x, barY, scale, false));
            }
            if (this.rightWidth > 0) {
                rendered.push(this.initBar(this.rightType, x + this.leftWidth * scale, barY, scale, true));
            }
            if (typeof this.number !== "undefined") {
                rendered.push(this.renderNumber(x, y, scale));
            }
            return rendered;
        },
        renderNumber: function(x, y, scale) {
            return this.numberItem.render(x + this.leftWidth * scale, y - this.numberOffset * scale - this.numberHeight[1] * scale, scale);
        },
        initBar: function(type, x, y, scale, isRight) {
            var lines = this.parent.numberOfLines;
            var bar = new Kinetic.Group({});
            var barWidth = 2 * scale;
            var dotDiameter = 6 * scale;
            var offset = 5 * scale;
            var startX = x;
            var b1, b2;
            var linePadding = Euterpe.global.linePadding;
            var lineWidth = Euterpe.global.lineWidth;
            var barHeight = linePadding * (lines - 1) + lineWidth * lines - lineWidth / 2 + lineWidth / 2;
            if (type === "single") {
                startX = x + barWidth / 2;
                var b = new Kinetic.Line({
                    points: [ 0, 0, 0, barHeight ],
                    stroke: "black",
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });
                bar.add(b);
            } else if (type === "double") {
                startX = x + barWidth / 2;
                b1 = new Kinetic.Line({
                    points: [ 0, 0, 0, barHeight ],
                    stroke: "black",
                    strokeWidth: barWidth,
                    x: startX,
                    y: y
                });
                b2 = b1.clone({
                    x: startX + offset
                });
                bar.add(b1);
                bar.add(b2);
            } else if (type === "double bold" || type === "repeat") {
                var x1, x2, x3, sw1, sw2, sw3;
                var bigWidth = barWidth * 3;
                var barf = function(sw, x) {
                    return new Kinetic.Line({
                        points: [ 0, 0, 0, barHeight ],
                        stroke: "black",
                        strokeWidth: sw,
                        x: x,
                        y: y
                    });
                };
                var circlef = function(x) {
                    var line2 = Euterpe.getY(1, scale, y);
                    var line3 = Euterpe.getY(2, scale, y);
                    var g = new Kinetic.Group();
                    var dot = new Kinetic.Circle({
                        x: x,
                        y: line2 + 7 * scale,
                        radius: dotDiameter / 2,
                        fill: "black",
                        strokeWidth: 0
                    });
                    g.add(dot);
                    g.add(dot.clone({
                        y: line3 + 7 * scale
                    }));
                    return g;
                };
                var objs = [];
                if (isRight) {
                    sw1 = bigWidth;
                    sw2 = barWidth;
                    sw3 = dotDiameter;
                    x1 = x + sw1 / 2;
                    x2 = x + sw1 + offset + sw2 / 2;
                    x3 = x + sw1 + offset + sw2 + offset + sw3 / 2;
                    objs.push(barf(sw1, x1));
                    objs.push(barf(sw2, x2));
                    if (type === "repeat") {
                        objs.push(circlef(x3));
                    }
                } else if (type == "repeat") {
                    sw1 = dotDiameter;
                    sw2 = barWidth;
                    sw3 = bigWidth;
                    x1 = x + sw1 / 2;
                    x2 = x + sw1 + offset + sw2 / 2;
                    x3 = x + sw1 + offset + sw2 + offset + sw3 / 2;
                    objs.push(circlef(x1));
                    objs.push(barf(sw2, x2));
                    objs.push(barf(sw3, x3));
                } else {
                    sw1 = barWidth;
                    sw2 = bigWidth;
                    x1 = x + sw1 / 2;
                    x2 = x + sw1 + offset + sw2 / 2;
                    objs.push(barf(sw1, x1));
                    objs.push(barf(sw2, x2));
                }
                _.each(objs, function(obj) {
                    bar.add(obj);
                });
            }
            return bar;
        }
    });
    return Bar;
}();

Euterpe.Text = function() {
    function Text(config) {
        this.text = Euterpe.getConfig(config, "text");
        this.color = Euterpe.getConfig(config, "color", "black");
        this.fontFamily = Euterpe.getConfig(config, "fontFamily", "Arial");
        this.fontSize = Euterpe.getConfig(config, "fontSize", 10);
        this.fontStyle = Euterpe.getConfig(config, "fontStyle", "normal");
        var scale = 1;
        var tmp = new Kinetic.Text({
            x: 0,
            y: 0,
            text: this.text,
            fontSize: this.fontSize * scale,
            fontFamily: this.fontFamily,
            fontStyle: this.fontStyle
        });
        var h = tmp.height() / scale;
        this.realWidth = tmp.width() / scale;
        this.realHeight = [ h / 2, h / 2 ];
        Text.super.call(this, "Euterpe.Text", config);
    }
    Euterpe.extend(Euterpe.Node, Text, {
        render: function(x, y, scale) {
            var rendered = [ new Kinetic.Text({
                x: x,
                y: y - (this.realHeight[0] * scale + this.realHeight[1] * scale) / 2,
                text: this.text,
                fontSize: this.fontSize * scale,
                fontFamily: this.fontFamily,
                fontStyle: this.fontStyle,
                fill: this.color
            }) ];
            Euterpe.bind(this, rendered);
            return rendered;
        }
    });
    return Text;
}();

Euterpe.Rest = function() {
    function Rest(config) {
        this.type = Euterpe.getConfig(config, "type", "long");
        Rest.super.call(this, "Euterpe.Rest", config);
        this.basicWidth = 7;
        switch (this.type) {
          case "long":
            this.realWidth = this.basicWidth;
            this.realHeight = [ 0, 28 ];
            break;

          case "double_whole":
            this.realWidth = this.basicWidth;
            this.realHeight = [ 0, 14.5 ];
            break;

          case "whole":
            this.realWidth = 20;
            this.realHeight = [ 0, 8 ];
            break;

          case "half":
            this.realWidth = 20;
            this.realHeight = [ 6, 0 ];
            break;

          case "quarter":
            this.realWidth = 20;
            this.realHeight = [ 16.75, 22.25 ];
            break;

          case "eighth":
            this.realWidth = 20;
            this.realHeight = [ 9.5, 16.25 ];
            break;

          case "sixteenth":
            this.realWidth = 20;
            this.realHeight = [ 9.5, 30.25 ];
            break;

          case "thirty-second":
            this.realWidth = 25;
            this.realHeight = [ 9.5, 43.25 ];
            break;

          case "sixty-fourth":
            this.realWidth = 30;
            this.realHeight = [ 9.5, 55.75 ];
            break;
        }
    }
    Euterpe.extend(Euterpe.Node, Rest, {
        render: function(x, y, scale) {
            var startX = x + this.getRealWidth(scale) / 2;
            var rendered = [];
            switch (this.type) {
              case "half":
                rendered.push(this.initHalf(startX, y, scale));
                break;

              case "quarter":
                rendered.push(this.initQuarter(startX, y, scale));
                break;

              case "eighth":
                rendered.push(this.initEighth(startX, y, scale));
                break;

              case "sixteenth":
                rendered.push(this.initSixteen(startX, y, scale));
                break;

              case "thirty-second":
                rendered.push(this.initThirtySecond(startX, y, scale));
                break;

              case "sixty-fourth":
                rendered.push(this.initSixtyFourth(startX, y, scale));
                break;

              default:
                rendered.push(this.simpleRestShape(startX, y, scale));
            }
            Euterpe.bind(this, rendered);
            return rendered;
        },
        initHalf: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);
            return this.simpleRestShape(x, y - h[0], scale);
        },
        initQuarter: function(x, y, scale) {
            var sc = scale * .125;
            var h = this.getRealHeight(scale, true);
            var startY = y - h[0];
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);
                    ctx.beginPath();
                    ctx.moveTo(100.2, 80.7);
                    ctx.bezierCurveTo(100.2, 100.2, 61.1, 129.6, 61.1, 168.7);
                    ctx.bezierCurveTo(61.1, 183.4, 90.4, 227.5, 110, 251.9);
                    ctx.bezierCurveTo(100.2, 247, 90.4, 242.1, 75.8, 242.1);
                    ctx.bezierCurveTo(46.4, 242.1, 36.6, 266.6, 36.6, 281.3);
                    ctx.bezierCurveTo(36.6, 291.1, 46.4, 300.9, 51.3, 310.7);
                    ctx.bezierCurveTo(21.9, 291.1, 2.4, 271.5, 2.4, 251.9);
                    ctx.bezierCurveTo(2.4, 203, 35.8, 220.1, 60.2, 210.3);
                    ctx.bezierCurveTo(35.8, 185.9, 12.1, 149.2, 12.1, 134.5);
                    ctx.bezierCurveTo(12.1, 124.7, 41.5, 90.4, 51.3, 66);
                    ctx.lineTo(51.3, 51.3);
                    ctx.bezierCurveTo(51.3, 36.6, 41.5, 17, 36.6, 2.4);
                    ctx.bezierCurveTo(56.2, 26.8, 100.2, 70.9, 100.2, 80.7);
                    ctx.lineTo(100.2, 80.7);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        },
        initEighth: function(x, y, scale) {
            var sc = scale * .125;
            var h = this.getRealHeight(scale, true);
            var startY = y - h[0];
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);
                    ctx.beginPath();
                    ctx.moveTo(92.9, 5.2);
                    ctx.bezierCurveTo(90.4, 14.4, 88.4, 21.5, 88.1, 21.9);
                    ctx.bezierCurveTo(84.9, 28.7, 78.5, 37.2, 73.6, 42.1);
                    ctx.bezierCurveTo(68.4, 47.3, 65.5, 48.2, 61.1, 46.5);
                    ctx.bezierCurveTo(57.4, 44.5, 56.2, 42.4, 53.8, 31.5);
                    ctx.bezierCurveTo(51.7, 23.4, 50.2, 19, 46.9, 15.8);
                    ctx.bezierCurveTo(38.4, 6.5, 23.8, 5.3, 12.6, 12.6);
                    ctx.bezierCurveTo(7.3, 16.2, 3.3, 21.9, .9, 28);
                    ctx.bezierCurveTo(0, 31.1, 0, 32, 0, 36.4);
                    ctx.bezierCurveTo(0, 40.9, 0, 42.4, .9, 44.9);
                    ctx.bezierCurveTo(3.6, 53.8, 9.3, 60.7, 18.2, 64.7);
                    ctx.bezierCurveTo(24.7, 68, 27.1, 68.4, 36, 68.4);
                    ctx.bezierCurveTo(42.5, 68.4, 44.5, 68.4, 49.8, 67.5);
                    ctx.bezierCurveTo(57.1, 66.3, 64.7, 63.9, 73.2, 61.5);
                    ctx.lineTo(78.5, 59.4);
                    ctx.lineTo(78.5, 60.7);
                    ctx.bezierCurveTo(78, 62.3, 44.1, 190, 43.7, 190.8);
                    ctx.bezierCurveTo(43.3, 192.4, 50.6, 195.6, 55, 195.6);
                    ctx.bezierCurveTo(59.4, 195.6, 65.9, 192.8, 66.3, 190.8);
                    ctx.bezierCurveTo(66.7, 190.4, 86.1, 106.8, 110.3, 5.1);
                    ctx.bezierCurveTo(107.1, -2.6, 98.1, -.8, 92.9, 5.2);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        },
        initSixteen: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);
            var sc = scale * .125;
            var startY = y - h[0];
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);
                    ctx.beginPath();
                    ctx.moveTo(132.4, 0);
                    ctx.bezierCurveTo(126.7, 0, 121.8, 4.5, 120.8, 9.5);
                    ctx.bezierCurveTo(118, 21.7, 117.1, 25.3, 116.8, 26.1);
                    ctx.bezierCurveTo(114.2, 31.6, 107.4, 42.3, 102.3, 47.8);
                    ctx.bezierCurveTo(96.7, 52.9, 94.2, 53.8, 89.5, 52.1);
                    ctx.bezierCurveTo(85.7, 50, 84.4, 47.8, 81.9, 36.3);
                    ctx.bezierCurveTo(79.7, 27.8, 78, 23.1, 74.6, 19.8);
                    ctx.bezierCurveTo(65.6, 9.9, 50.3, 8.6, 38.3, 16.3);
                    ctx.bezierCurveTo(32.8, 20.2, 28.6, 26.1, 26, 32.6);
                    ctx.bezierCurveTo(25.1, 35.9, 25.1, 36.8, 25.1, 41.5);
                    ctx.bezierCurveTo(25.1, 47.8, 25.6, 51.3, 28.6, 56.3);
                    ctx.bezierCurveTo(32.8, 64.9, 41.8, 71.7, 52, 74.2);
                    ctx.bezierCurveTo(63.1, 77.2, 81.4, 74.7, 102.3, 67.9);
                    ctx.bezierCurveTo(105.2, 66.6, 108.2, 65.7, 108.2, 65.7);
                    ctx.bezierCurveTo(108.2, 66.2, 104.8, 80.2, 101, 97.7);
                    ctx.bezierCurveTo(94.6, 127.5, 94.2, 129.7, 92, 133.4);
                    ctx.bezierCurveTo(88.6, 140.7, 81, 151, 75.8, 155.6);
                    ctx.bezierCurveTo(71.6, 159.5, 68.7, 160.3, 64.4, 158.6);
                    ctx.bezierCurveTo(60.6, 156.5, 59.2, 154.3, 56.7, 142.9);
                    ctx.bezierCurveTo(54.5, 134.3, 52.9, 129.7, 49.4, 126.2);
                    ctx.bezierCurveTo(40.5, 116.4, 25.1, 115.2, 13.2, 122.8);
                    ctx.bezierCurveTo(7.7, 126.7, 3.4, 132.6, .9, 139);
                    ctx.bezierCurveTo(0, 142.5, 0, 143.3, 0, 148);
                    ctx.bezierCurveTo(0, 154.3, .4, 157.7, 3.4, 162.8);
                    ctx.bezierCurveTo(7.7, 171.4, 16.6, 178.2, 26.9, 180.8);
                    ctx.bezierCurveTo(37.9, 183.7, 59.2, 180.8, 80.1, 173.5);
                    ctx.bezierCurveTo(82.7, 172.7, 84.4, 172.3, 84.4, 172.3);
                    ctx.bezierCurveTo(84.4, 172.7, 54.5, 306.4, 53.3, 310.7);
                    ctx.bezierCurveTo(53.3, 311.6, 53.7, 312, 55.4, 312.8);
                    ctx.bezierCurveTo(58, 314.5, 62.2, 315.9, 65.2, 315.9);
                    ctx.bezierCurveTo(68.2, 315.9, 72.4, 314.5, 75, 312.8);
                    ctx.bezierCurveTo(76.7, 312, 77.2, 311.6, 77.6, 309.4);
                    ctx.bezierCurveTo(77.6, 308.2, 100.1, 196.1, 127.9, 60.2);
                    ctx.bezierCurveTo(131.9, 40.2, 133.1, 33.9, 136.5, 17);
                    ctx.bezierCurveTo(137.7, 11.1, 139.7, 0, 132.4, 0);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        },
        initThirtySecond: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);
            var sc = scale * .125;
            var startY = y - h[0];
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);
                    ctx.beginPath();
                    ctx.moveTo(154.4, 0);
                    ctx.bezierCurveTo(152.8, 0, 146, -0, 144.3, 7.4);
                    ctx.bezierCurveTo(141.2, 20.7, 140.5, 22.5, 138.9, 25.3);
                    ctx.bezierCurveTo(134.2, 35.1, 127.5, 44.5, 122.7, 47.5);
                    ctx.bezierCurveTo(120.2, 49.2, 118, 49.2, 115.1, 47.9);
                    ctx.bezierCurveTo(111.2, 45.8, 109.9, 43.6, 107.4, 32.1);
                    ctx.bezierCurveTo(105.2, 23.6, 103.6, 18.9, 100.1, 15.5);
                    ctx.bezierCurveTo(91.2, 5.7, 75.8, 4.5, 63.9, 12.1);
                    ctx.bezierCurveTo(58.4, 15.9, 54.1, 21.9, 51.6, 28.3);
                    ctx.bezierCurveTo(50.7, 31.7, 50.7, 32.5, 50.7, 37.2);
                    ctx.bezierCurveTo(50.7, 43.6, 51.1, 47.1, 54.1, 52.2);
                    ctx.bezierCurveTo(58.4, 60.7, 67.3, 67.5, 77.6, 70);
                    ctx.bezierCurveTo(82.3, 71.4, 94.2, 71.4, 102.3, 70);
                    ctx.bezierCurveTo(109.1, 68.8, 117.2, 66.6, 125.3, 64.1);
                    ctx.bezierCurveTo(129.1, 62.8, 131.7, 61.9, 132.1, 61.9);
                    ctx.bezierCurveTo(132.1, 62.3, 117.6, 126.3, 116.8, 128.4);
                    ctx.bezierCurveTo(114.2, 133.9, 107.4, 144.6, 102.3, 150.1);
                    ctx.bezierCurveTo(96.7, 155.2, 94.2, 156.1, 89.5, 154.4);
                    ctx.bezierCurveTo(85.7, 152.3, 84.4, 150.1, 81.9, 138.6);
                    ctx.bezierCurveTo(79.7, 130.1, 78, 125.4, 74.6, 122.1);
                    ctx.bezierCurveTo(65.6, 112.2, 50.3, 111, 38.3, 118.6);
                    ctx.bezierCurveTo(32.8, 122.5, 28.6, 128.4, 26, 134.9);
                    ctx.bezierCurveTo(25.1, 138.2, 25.1, 139.1, 25.1, 143.8);
                    ctx.bezierCurveTo(25.1, 150.1, 25.6, 153.6, 28.6, 158.7);
                    ctx.bezierCurveTo(32.8, 167.2, 41.8, 174, 52, 176.5);
                    ctx.bezierCurveTo(63.1, 179.5, 81.4, 177, 102.3, 170.2);
                    ctx.bezierCurveTo(105.2, 168.9, 108.2, 168, 108.2, 168);
                    ctx.bezierCurveTo(108.2, 168.5, 104.8, 182.5, 101, 200);
                    ctx.bezierCurveTo(94.6, 229.8, 94.2, 232, 92, 235.7);
                    ctx.bezierCurveTo(88.6, 243, 81, 253.3, 75.8, 258);
                    ctx.bezierCurveTo(71.6, 261.8, 68.7, 262.6, 64.4, 260.9);
                    ctx.bezierCurveTo(60.6, 258.8, 59.2, 256.6, 56.7, 245.2);
                    ctx.bezierCurveTo(54.5, 236.7, 52.9, 232, 49.4, 228.5);
                    ctx.bezierCurveTo(40.5, 218.7, 25.1, 217.5, 13.2, 225.1);
                    ctx.bezierCurveTo(7.7, 229, 3.4, 234.9, .9, 241.3);
                    ctx.bezierCurveTo(0, 244.8, 0, 245.6, 0, 250.3);
                    ctx.bezierCurveTo(0, 256.6, .4, 260, 3.4, 265.1);
                    ctx.bezierCurveTo(7.7, 273.7, 16.6, 280.5, 26.9, 283.1);
                    ctx.bezierCurveTo(37.9, 286, 59.2, 283.1, 80.1, 275.8);
                    ctx.bezierCurveTo(82.7, 275, 84.4, 274.6, 84.4, 274.6);
                    ctx.bezierCurveTo(84.4, 275, 54.5, 408.7, 53.3, 413);
                    ctx.bezierCurveTo(53.3, 413.9, 53.7, 414.3, 55.4, 415.2);
                    ctx.bezierCurveTo(58, 416.8, 62.2, 418.2, 65.2, 418.2);
                    ctx.bezierCurveTo(68.2, 418.2, 72.4, 416.8, 75, 415.2);
                    ctx.bezierCurveTo(76.7, 414.3, 77.2, 413.9, 77.6, 411.7);
                    ctx.bezierCurveTo(77.6, 410.5, 100.1, 298.4, 127.9, 162.5);
                    ctx.bezierCurveTo(141.5, 94.4, 151.4, 44.8, 158.6, 8.7);
                    ctx.bezierCurveTo(159.5, 4.3, 157.9, -.1, 154.4, 0);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        },
        initSixtyFourth: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);
            var sc = scale * .125;
            var startY = y - h[0];
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);
                    ctx.beginPath();
                    ctx.bezierCurveTo(89, 2.9, 80.5, 10.6, 76.7, 21.2);
                    ctx.bezierCurveTo(75.8, 24.6, 75.8, 25.4, 75.8, 30.1);
                    ctx.bezierCurveTo(75.8, 34.8, 75.8, 36.5, 76.7, 39.1);
                    ctx.bezierCurveTo(79.7, 48.5, 85.7, 55.7, 95, 59.9);
                    ctx.bezierCurveTo(101.8, 63.4, 104.4, 63.8, 113.8, 63.8);
                    ctx.bezierCurveTo(120.2, 63.8, 122.7, 63.8, 127.9, 63);
                    ctx.bezierCurveTo(134.6, 61.7, 144, 59.1, 151.3, 56.6);
                    ctx.lineTo(155.9, 54.8);
                    ctx.lineTo(155.5, 56.6);
                    ctx.bezierCurveTo(155.1, 57.4, 152.1, 72.3, 148.2, 89.3);
                    ctx.bezierCurveTo(141.5, 119.2, 141.1, 120.9, 138.9, 124.7);
                    ctx.bezierCurveTo(134.2, 134.5, 127.5, 143.9, 122.7, 146.9);
                    ctx.bezierCurveTo(120.2, 148.6, 118, 148.6, 115.1, 147.3);
                    ctx.bezierCurveTo(111.2, 145.2, 109.9, 143, 107.4, 131.5);
                    ctx.bezierCurveTo(105.2, 123, 103.6, 118.3, 100.1, 114.9);
                    ctx.bezierCurveTo(91.2, 105.1, 75.8, 103.9, 63.9, 111.5);
                    ctx.bezierCurveTo(58.4, 115.3, 54.1, 121.3, 51.6, 127.7);
                    ctx.bezierCurveTo(50.7, 131.1, 50.7, 131.9, 50.7, 136.6);
                    ctx.bezierCurveTo(50.7, 143, 51.1, 146.5, 54.1, 151.6);
                    ctx.bezierCurveTo(58.4, 160.1, 67.3, 166.9, 77.6, 169.4);
                    ctx.bezierCurveTo(82.3, 170.8, 94.2, 170.8, 102.3, 169.4);
                    ctx.bezierCurveTo(109.1, 168.2, 117.2, 166, 125.3, 163.5);
                    ctx.bezierCurveTo(129.1, 162.3, 131.7, 161.3, 132.1, 161.3);
                    ctx.bezierCurveTo(132.1, 161.8, 117.6, 225.7, 116.8, 227.8);
                    ctx.bezierCurveTo(114.2, 233.3, 107.4, 244, 102.3, 249.5);
                    ctx.bezierCurveTo(96.7, 254.6, 94.2, 255.6, 89.5, 253.8);
                    ctx.bezierCurveTo(85.7, 251.7, 84.4, 249.5, 81.9, 238);
                    ctx.bezierCurveTo(79.7, 229.5, 78, 224.8, 74.6, 221.5);
                    ctx.bezierCurveTo(65.6, 211.6, 50.3, 210.4, 38.3, 218);
                    ctx.bezierCurveTo(32.8, 221.9, 28.6, 227.8, 26, 234.3);
                    ctx.bezierCurveTo(25.1, 237.6, 25.1, 238.5, 25.1, 243.2);
                    ctx.bezierCurveTo(25.1, 249.5, 25.6, 253, 28.6, 258.1);
                    ctx.bezierCurveTo(32.8, 266.6, 41.8, 273.4, 52, 275.9);
                    ctx.bezierCurveTo(63.1, 278.9, 81.4, 276.4, 102.3, 269.6);
                    ctx.bezierCurveTo(105.2, 268.3, 108.2, 267.4, 108.2, 267.4);
                    ctx.bezierCurveTo(108.2, 267.9, 104.8, 281.9, 101, 299.4);
                    ctx.bezierCurveTo(94.6, 329.2, 94.2, 331.4, 92, 335.1);
                    ctx.bezierCurveTo(88.6, 342.4, 81, 352.7, 75.8, 357.4);
                    ctx.bezierCurveTo(71.6, 361.2, 68.7, 362, 64.4, 360.3);
                    ctx.bezierCurveTo(60.6, 358.2, 59.2, 356, 56.7, 344.6);
                    ctx.bezierCurveTo(54.5, 336.1, 52.9, 331.4, 49.4, 328);
                    ctx.bezierCurveTo(40.5, 318.1, 25.1, 316.9, 13.2, 324.5);
                    ctx.bezierCurveTo(7.7, 328.4, 3.4, 334.3, .9, 340.7);
                    ctx.bezierCurveTo(0, 344.2, 0, 345, 0, 349.7);
                    ctx.bezierCurveTo(0, 356, .4, 359.4, 3.4, 364.5);
                    ctx.bezierCurveTo(7.7, 373.1, 16.6, 379.9, 26.9, 382.5);
                    ctx.bezierCurveTo(37.9, 385.4, 59.2, 382.5, 80.1, 375.2);
                    ctx.bezierCurveTo(82.7, 374.4, 84.4, 374, 84.4, 374);
                    ctx.bezierCurveTo(84.4, 374.4, 54.5, 508.1, 53.3, 512.4);
                    ctx.bezierCurveTo(53.3, 513.3, 53.7, 513.7, 55.4, 514.6);
                    ctx.bezierCurveTo(58, 516.2, 62.2, 517.6, 65.2, 517.6);
                    ctx.bezierCurveTo(68.2, 517.6, 72.4, 516.2, 75, 514.6);
                    ctx.bezierCurveTo(76.7, 513.7, 77.2, 513.3, 77.6, 511.1);
                    ctx.bezierCurveTo(77.6, 509.9, 100.1, 397.8, 127.9, 261.9);
                    ctx.bezierCurveTo(171.7, 42.9, 177.2, 14.8, 176.8, 13.9);
                    ctx.bezierCurveTo(175.6, 11.8, 173.9, 11, 171.3, 11);
                    ctx.bezierCurveTo(167.5, 11, 166.6, 11.8, 162.8, 19.1);
                    ctx.bezierCurveTo(157.3, 29.7, 151.7, 37.4, 147.8, 40.4);
                    ctx.bezierCurveTo(145.7, 42.1, 143.6, 42.1, 140.2, 40.8);
                    ctx.bezierCurveTo(136.4, 38.6, 135.1, 36.5, 132.5, 25);
                    ctx.bezierCurveTo(130, 13.5, 126.9, 8.4, 120.6, 4.1);
                    ctx.bezierCurveTo(114.6, .3, 107, -.9, 100.1, .7);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        },
        simpleRestShape: function(x, y, scale) {
            return new Kinetic.Rect({
                x: x,
                y: y,
                width: this.getRealWidth(scale),
                height: this.getRealHeight(scale),
                fill: "black",
                strokeWidth: 0
            });
        }
    });
    return Rest;
}();

Euterpe.StringNumber = function() {
    function StringNumber(config) {
        this.string = Euterpe.getConfig(config, "string");
        this.fontSize = 10;
        this.fontFamily = "Arial";
        if (typeof this.string !== "number" || this.string < 0 || this.string > 6) {
            throw "Invalid string value";
        } else {
            this.string = this.string.toString();
        }
        this.textWidth = 5;
        this.textHeight = 7.6;
        this.realWidth = 21.3;
        this.realHeight = [ 10.65, 10.65 ];
        StringNumber.super.call(this, "Euterpe.StringNumber", config);
    }
    Euterpe.extend(Euterpe.Node, StringNumber, {
        render: function(x, y, scale) {
            var rendered = [];
            var startX = x + this.realWidth * scale / 2;
            rendered.push(new Kinetic.Circle({
                x: startX,
                y: y,
                radius: 10 * scale,
                fill: "white",
                stroke: "black",
                strokeWidth: scale
            }));
            rendered.push(new Kinetic.Text({
                x: startX - this.textWidth * scale / 2,
                y: y - this.textHeight * scale / 2,
                text: this.string,
                fontSize: this.fontSize * scale,
                fontFamily: this.fontFamily,
                fill: "black"
            }));
            Euterpe.bind(this, rendered);
            return rendered;
        }
    });
    return StringNumber;
}();

Euterpe.KeySignature = function() {
    function KeySignature(config) {
        this.type = Euterpe.getConfig(config, "type");
        this.amount = Euterpe.getConfig(config, "amount");
        if (this.type !== "sharp" && this.type !== "flat") {
            throw "Invalid type argument";
        }
        if (typeof this.amount !== "number" || this.amount < 1 || this.amount > 7) {
            throw "amount should be >= 1 and <= 7";
        }
        KeySignature.super.call(this, "Euterpe.KeySignature", config);
        var locations = {
            sharp: [ 0, 1.5, -.5, 1, 2.5, .5, 2 ],
            flat: [ 2, .5, 2.5, 1, 3, 1.5, 3.5 ]
        };
        for (var i = 0; i < this.amount; i++) {
            var cfg = {
                location: locations[this.type][i]
            };
            this.add(this.type === "sharp" ? new Euterpe.Sharp(cfg) : new Euterpe.Flat(cfg));
        }
    }
    Euterpe.extend(Euterpe.Container, KeySignature);
    return KeySignature;
}();

Euterpe.Plugin = function() {
    var Plugin = function(name, config) {
        this.name = name;
        this.config = config || {};
    };
    Plugin.prototype.isPlugin = true;
    Plugin.prototype.process = function(item) {
        return item;
    };
    return Plugin;
}();

Euterpe.PluginNoteBar = function() {
    var PluginNoteBar = function(config) {
        PluginNoteBar.super.call(this, "Euterpe.PluginNoteBar", config);
    };
    Euterpe.extend(Euterpe.Plugin, PluginNoteBar, {
        process: function(root, scale, extra) {
            var columns = Euterpe.select("Euterpe.Column", root);
            var ids = [];
            var current = {};
            var dir = 1;
            var dirs = {};
            var bid = null;
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                for (var j = 0; j < column.items.length; j++) {
                    var item = column.items[j];
                    var cfg = item.config || {};
                    if (cfg.bar === "begin") {
                        bid = Euterpe.randomString(10);
                    }
                    var bar_id = cfg.bar_id || bid;
                    if (!_.isArray(current[bar_id])) {
                        current[bar_id] = [];
                    }
                    if (cfg.bar === "begin" || cfg.bar === "cont" || cfg.bar === "end") {
                        dir = cfg.beamDirection === "down" ? -1 : 1;
                        dirs[ids.length] = dir;
                        item.__note_bar_flags = item.flags;
                        item.flags = 0;
                        current[bar_id].push(item.id);
                        if (cfg.bar === "end") {
                            this.adjustBeamHeight(current[bar_id], dir, scale);
                            ids.push(_.clone(current[bar_id]));
                            current.length = 0;
                        }
                    }
                }
            }
            for (var k = 0; k < ids.length; k++) {
                extra.push(this.bind(ids[k], dirs[k]));
            }
            return root;
        },
        getTopTwo: function(items, dir) {
            var sorted = _.clone(items);
            sorted.sort(function(a, b) {
                if (dir === 1) {
                    return a.config.location - b.config.location;
                } else {
                    return b.config.location - a.config.location;
                }
            });
            if (sorted.length > 2) {
                return [ sorted[0], sorted[1] ];
            } else {
                return sorted;
            }
        },
        adjustBeamHeight: function(ids, dir, scale) {
            ids = _.map(ids, function(obj) {
                return Euterpe.select("#" + obj)[0];
            });
            if (ids.length > 2) {
                var sorted = this.getTopTwo(ids, dir);
                var getY = function(item, baseY) {
                    return Euterpe.getY(item, scale, baseY) - item.beamRealHeight * scale * dir;
                };
                var first = sorted[0];
                var last = sorted[1];
                var row = first.parent.parent;
                var firstX = Euterpe.getDistance(row, first, scale);
                var lastX = Euterpe.getDistance(row, last, scale);
                for (var i = 0; i < ids.length; i++) {
                    if (ids[i].id === first.id || ids[i].id === last.id) {
                        continue;
                    }
                    var base = Math.abs(Euterpe.getY(ids[i], scale, 0));
                    var firstY = getY(first, base);
                    var lastY = getY(last, base);
                    var slope = (lastY - firstY) / (lastX - firstX);
                    var X = Euterpe.getDistance(row, ids[i], scale) + ids[i].getLeftWidth(scale);
                    var curY = getY(ids[i], base);
                    var newY = slope * (X - firstX) + firstY;
                    var diff = curY - newY;
                    if (diff !== 0) {
                        ids[i].beamRealHeight += diff * dir / scale;
                        ids[i].calculateSize();
                    }
                }
            }
        },
        bind: function(ids, dir) {
            ids = _.map(ids, function(obj) {
                return Euterpe.select("#" + obj)[0];
            });
            return function(root, scale) {
                var scene = function(sx, sy, lx, ly, off, width, dir) {
                    return function(ctx) {
                        ctx.beginPath();
                        ctx.moveTo(sx, sy + off);
                        ctx.lineTo(lx, ly + off);
                        ctx.lineTo(lx, ly + off + width * dir);
                        ctx.lineTo(sx, sy + off + width * dir);
                        ctx.moveTo(sx, sy);
                        ctx.closePath();
                        ctx.fillStrokeShape(this);
                    };
                };
                var assets = [];
                var width = 4 * scale;
                var partial = 10 * scale;
                var gfirst = ids[0];
                var glast = ids[ids.length - 1];
                var gfx = gfirst.beam.x();
                var gfy = gfirst.beam.y() - gfirst.beamHeight * dir;
                var lx = glast.beam.x();
                var ly = glast.beam.y() - glast.beamHeight * dir;
                var slope = (ly - gfy) / (lx - gfx);
                var flags = _.max(_.map(ids, function(obj) {
                    return obj.__note_bar_flags;
                }));
                var off = 0;
                for (var f = 1; f <= flags; f++) {
                    for (var i = 0; i < ids.length; i++) {
                        var cols = [];
                        while (i < ids.length && ids[i].__note_bar_flags >= f) {
                            cols.push(ids[i++]);
                        }
                        if (cols.length === 0) {
                            continue;
                        }
                        var first = cols[0];
                        var fx = first.beam.x();
                        var fy = first.beam.y() - first.beamHeight * dir;
                        var second = cols.length > 1 ? cols[cols.length - 1] : first;
                        var sx = second.beam.x();
                        var sy = second.beam.y() - second.beamHeight * dir;
                        if (first.id === second.id) {
                            if (i === ids.length) {
                                fx = sx - partial;
                                fy = sy - partial * slope;
                            } else {
                                sx = fx + partial;
                                sy = fy + partial * slope;
                            }
                        }
                        var bar = new Kinetic.Shape({
                            sceneFunc: scene(fx, fy, sx, sy, off, width, dir),
                            fill: "black",
                            stroke: "black",
                            strokeWidth: 0
                        });
                        assets.push(bar);
                    }
                    off += width * dir + 3 * dir * scale;
                }
                return assets;
            };
        }
    });
    return PluginNoteBar;
}();

Euterpe.PluginNoteText = function() {
    var PluginNoteText = function(config) {
        PluginNoteText.super.call(this, "Euterpe.PluginNoteText", config);
    };
    Euterpe.extend(Euterpe.Plugin, PluginNoteText, {
        process: function(root) {
            var notes = Euterpe.select("Euterpe.Note", root);
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                if (typeof note.config.text === "undefined") {
                    continue;
                }
                var txt = new Euterpe.Text({
                    text: note.config.text
                });
                note.leftItems.push(txt);
            }
            return root;
        }
    });
    return PluginNoteText;
}();

Euterpe.PluginAccidentals = function() {
    var PluginAccidentals = function(config) {
        PluginAccidentals.super.call(this, "Euterpe.PluginAccidentals", config);
    };
    Euterpe.extend(Euterpe.Plugin, PluginAccidentals, {
        process: function(root) {
            var notes = Euterpe.select("Euterpe.Note", root);
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                if (typeof note.config.sharp === "undefined" && typeof note.config.flat === "undefined") {
                    continue;
                }
                var count = note.config.sharp || note.config.flat;
                for (var x = 0; x < count; x++) {
                    if (typeof note.config.sharp !== "undefined") {
                        note.leftItems.push(new Euterpe.Sharp({}));
                    } else if (typeof note.config.flat !== "undefined") {
                        note.leftItems.push(new Euterpe.Flat({}));
                    }
                }
            }
            return root;
        }
    });
    return PluginAccidentals;
}();

Euterpe.PluginAboveBelow = function() {
    var PluginAboveBelow = function(config) {
        PluginAboveBelow.super.call(this, "Euterpe.PluginAboveBelow", config);
    };
    Euterpe.extend(Euterpe.Plugin, PluginAboveBelow, {
        roundLine: function(val) {
            var d, r;
            if (val < 0) {
                d = val - Math.ceil(val);
                if (d === 0) {
                    r = val;
                } else if (d >= -.5) {
                    r = Math.ceil(val) - .5;
                } else {
                    r = Math.floor(val);
                }
                return r;
            } else {
                d = val - Math.floor(val);
                if (d === 0) {
                    r = val;
                } else if (d <= .5) {
                    r = Math.floor(val) + .5;
                } else {
                    r = Math.ceil(val);
                }
                return r;
            }
        },
        place: function(items, scale, pos, startLoc) {
            var loc = 0, prevLoc;
            var h, up, down;
            if (typeof startLoc === "number") {
                prevLoc = startLoc;
            } else if (pos === "above") {
                prevLoc = 0;
            } else if (pos === "below") {
                prevLoc = 4;
            }
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                h = item.getRealHeight(scale, true);
                up = h[0] / this.lineH;
                down = h[1] / this.lineH;
                if (pos === "above") {
                    loc = prevLoc - this.roundLine(down);
                    prevLoc = loc - this.roundLine(up);
                } else if (pos === "below") {
                    loc = prevLoc + this.roundLine(down);
                    prevLoc = loc + this.roundLine(up);
                }
                item.config.location = loc;
            }
        },
        process: function(root, scale) {
            this.lineH = Euterpe.global.linePadding + Euterpe.global.lineWidth;
            var columns = Euterpe.select("Euterpe.Column", root);
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                var cfg = column.config;
                var h = column.getRealHeight(scale, true);
                var up = this.roundLine(h[0] / this.lineH * -1);
                var down = this.roundLine(h[1] / this.lineH);
                if (down < 4) {
                    down = 4;
                }
                if (_.isArray(cfg.aboveItems)) {
                    this.place(cfg.aboveItems, scale, "above", up);
                }
                if (_.isArray(cfg.belowItems)) {
                    this.place(cfg.belowItems, scale, "below", down);
                }
            }
            return root;
        }
    });
    return PluginAboveBelow;
}();

Euterpe.PluginTab = function() {
    var PluginTab = function(config) {
        PluginTab.super.call(this, "Euterpe.PluginTab", config);
    };
    Euterpe.extend(Euterpe.Plugin, PluginTab, {
        process: function(root) {
            for (var i = 0; i < root.items.length; i++) {
                var row = root.items[i];
                var tab = new Euterpe.Row({
                    type: "tab"
                });
                for (var j = 0; j < row.items.length; j++) {
                    var col = row.items[j];
                    if (col.name == "Euterpe.Bar") {
                        tab.add(col.clone());
                        continue;
                    }
                    var tcol = new Euterpe.Column({});
                    var notes = Euterpe.select("Euterpe.Note", col);
                    for (var z = 0; z < notes.length; z++) {
                        var note = notes[z];
                        if (typeof note.config.tab_location === "number" && typeof note.config.tab_text === "string") {
                            row.group = i.toString();
                            row.groupType = "bracket";
                            tab.group = row.group;
                            tab.groupType = row.groupType;
                            tcol.add(new Euterpe.Text({
                                text: note.config.tab_text,
                                location: note.config.tab_location
                            }));
                        }
                    }
                    if (tab !== null && tcol.items.length > 0) {
                        tab.add(tcol);
                    }
                }
                if (typeof tab.group !== "undefined") {
                    root.items.splice(i + 1, 0, tab);
                }
            }
            return root;
        }
    });
    return PluginTab;
}();

Euterpe.PluginAlign = function() {
    var PluginAlign = function(config) {
        this.totalWidth = Euterpe.getConfig(config, "totalWidth");
        this.nodeMargin = Euterpe.getConfig(config, "nodeMargin", 5);
        this.sideMargin = Euterpe.getConfig(config, "sideMargin", 3);
        PluginAlign.super.call(this, "Euterpe.PluginAlign", config);
    };
    Euterpe.extend(Euterpe.Plugin, PluginAlign, {
        process: function(root, scale) {
            var i, row;
            for (i = 0; i < root.items.length; i++) {
                row = root.items[i];
                var j;
                var nodes = this.collectNodes(row);
                for (j = 0; j < nodes.length; j++) {
                    nodes[j].leftMargin = this.nodeMargin;
                }
                this.alignSideItems(row);
            }
            var groups = Euterpe.getGroups(root.items);
            for (i = 0; i < groups.length; i++) {
                this.processGroup(groups[i], scale);
            }
            return root;
        },
        alignSideItems: function(row) {
            var cols = Euterpe.select("Euterpe.Column", row);
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                for (var j = 0; j < col.items.length; j++) {
                    var item = col.items[j];
                    var z;
                    for (z = 0; z < item.leftItems.length; z++) {
                        item.leftItems[z].rightMargin = this.sideMargin;
                    }
                    for (z = 0; z < item.rightItems.length; z++) {
                        item.rightItems[z].leftMargin = this.sideMargin;
                    }
                }
            }
        },
        getColsBars: function(row) {
            var r = [];
            for (var j = 1; j < row.items.length; j++) {
                var col = row.items[j];
                if (col.name === "Euterpe.Column" || col.name === "Euterpe.Bar") {
                    r.push(col);
                }
            }
            return r;
        },
        stretchAlign: function(row, scale) {
            var rowWidth = row.getRealWidth(scale);
            var cols = this.getColsBars(row);
            var diff = this.totalWidth - rowWidth;
            var margin = diff / cols.length / scale;
            for (var j = 0; j < cols.length; j++) {
                cols[j].leftMargin += margin;
            }
        },
        getCols: function(items, i) {
            return _.map(items, function(a) {
                return a[i];
            });
        },
        cleanGroup: function(group) {
            var r = [];
            for (var i = 0; i < group.items.length; i++) {
                r[i] = this.getColsBars(group.items[i]);
            }
            return r;
        },
        processGroup: function(group, scale) {
            var items = this.cleanGroup(group);
            var i, j, col, cols;
            var size = _.max(_.map(items, function(row) {
                return row.length;
            }));
            for (i = 0; i < size; i++) {
                cols = this.getCols(items, i);
                var colDist = {};
                var colWidth = {};
                var rightWidth = {};
                for (j = 0; j < cols.length; j++) {
                    col = cols[j];
                    if (typeof col === "undefined") {
                        continue;
                    }
                    colDist[col.id] = Euterpe.getDistance(col.parent, col, scale) + col.leftMargin * scale + col.getLeftWidth(scale);
                    colWidth[col.id] = col.getRealWidth(scale, true);
                    rightWidth[col.id] = col.getRightWidth(scale);
                }
                var distance = _.max(_.values(colDist));
                var width = _.max(_.values(colWidth));
                var rwidth = _.max(_.values(rightWidth));
                for (j = 0; j < cols.length; j++) {
                    col = cols[j];
                    if (typeof col === "undefined") {
                        continue;
                    }
                    var d = colDist[col.id];
                    var w = colWidth[col.id];
                    var rw = rightWidth[col.id];
                    if (d < distance) {
                        col.leftMargin += (distance - d) / scale;
                    }
                    if (w < width) {
                        col.rightMargin += (width - w) / scale;
                    }
                    if (rw < rwidth) {
                        col.rightMargin += (rwidth - rw) / scale;
                    }
                }
            }
            var self = this;
            _.each(group.items, function(row) {
                self.stretchAlign(row, scale);
            });
        },
        collectNodes: function(row) {
            return _.filter(row.items, function(item) {
                return item.name !== "Euterpe.Bar" && item.name !== "Euterpe.Column";
            });
        }
    });
    return PluginAlign;
}();

Euterpe.Score = function() {
    function Score(config) {
        this.layer = config.layer;
        this.lineMargin = Euterpe.getConfig(config, "lineMargin", 0);
        this.titleMargin = Euterpe.getConfig(config, "titleMargin", 0);
        this.musicByMargin = Euterpe.getConfig(config, "musicByMargin", 0);
        this.tuningMargin = Euterpe.getConfig(config, "tuningMargin", 0);
        this.title = Euterpe.getConfig(config, "title", undefined);
        this.musicBy = Euterpe.getConfig(config, "musicBy", undefined);
        this.tuning = Euterpe.getConfig(config, "tuning", undefined);
        this.titleHeight = 0;
        this.musicByHeight = 0;
        this.tuningHeight = 0;
        if (typeof this.title !== "undefined") {
            this.titleText = new Euterpe.Text({
                text: this.title,
                fontSize: 40,
                fontFamily: "Serif"
            });
            this.titleWidth = this.titleText.getRealWidth(1);
            this.titleHeight = this.titleText.getRealHeight(1);
        }
        if (typeof this.musicBy !== "undefined") {
            this.musicByText = new Euterpe.Text({
                fontSize: 20,
                text: "Music by " + this.musicBy,
                fontFamily: "Serif"
            });
            this.musicByHeight = this.musicByText.getRealHeight(1);
        }
        if (typeof this.tuning !== "undefined") {
            this.tuningText = new Euterpe.Text({
                fontSize: 15,
                text: this.tuning,
                fontFamily: "Serif",
                fontStyle: "italic"
            });
            this.tuningHeight = this.tuningText.getRealHeight(1);
        }
        Score.super.call(this, "Euterpe.Score", config);
    }
    Euterpe.extend(Euterpe.Container, Score, {
        bracketExtraUp: 5,
        bracketExtraDown: 5,
        getRealHeight: function(scale, raw) {
            var h = this.doGetRealHeight(this.items, scale, raw);
            var acc = 0;
            acc += this.titleHeight * scale;
            acc += this.titleMargin * scale;
            acc += this.musicByHeight * scale;
            acc += this.musicByMargin * scale;
            acc += this.tuningHeight * scale;
            acc += this.tuningMargin * scale;
            if (raw) {
                h[0] += acc;
            } else {
                h += acc;
            }
            return h;
        },
        render: function(origX, y, scale) {
            var yoff = 0;
            var rendered = [];
            var i;
            var groups = Euterpe.getGroups(this.items);
            var xOff = 0;
            for (i = 0; i < groups.length; i++) {
                var group = groups[i];
                if (group.groupType === "bracket") {
                    if (6 > xOff) {
                        xOff = 6;
                    }
                }
            }
            origX += xOff * scale;
            var gid = 0;
            y = this.renderMeta(origX, y, scale, rendered);
            for (i = 0; i < this.items.length; i++) {
                var row = this.items[i];
                var h = this.doGetRealHeight([ row ], scale, true);
                if (yoff !== 0) {
                    yoff += h[0];
                }
                var _y = y + yoff;
                row.Y = _y;
                row.X = origX;
                if (gid < groups.length && groups[gid].first === row.id) {
                    rendered.push(this.renderBracket(origX - xOff * scale, _y, scale, groups[gid].items));
                    gid++;
                }
                yoff += h[1];
                rendered.push(row.render(origX, _y, scale));
            }
            return rendered;
        },
        renderMeta: function(x, y, scale, rendered) {
            var h = this.getRealHeight(scale, true);
            y -= h[0];
            var metaHeight = (this.titleHeight + this.musicByHeight + this.tuningHeight + this.titleMargin + this.musicByMargin + this.tuningMargin) * scale;
            if (typeof this.title !== "undefined") {
                y += this.titleHeight * scale / 2;
                rendered.push(this.renderText(this.titleText, this.titleWidth, x, y, scale, true));
                y += this.titleHeight * scale / 2;
                y += this.titleMargin * scale;
            }
            if (typeof this.musicBy !== "undefined") {
                y += this.musicByHeight * scale / 2;
                rendered.push(this.renderText(this.musicByText, 0, x, y, scale));
                y += this.musicByHeight * scale / 2;
                y += this.musicByMargin * scale;
            }
            if (typeof this.tuning !== "undefined") {
                y += this.tuningHeight * scale / 2;
                rendered.push(this.renderText(this.tuningText, 0, x, y, scale));
                y += this.tuningHeight * scale / 2;
                y += this.tuningMargin * scale;
            }
            y += h[0] - metaHeight;
            return y;
        },
        renderText: function(obj, width, x, y, scale, center) {
            var _x = x;
            if (center) {
                var totalW = this.items[0].getRealWidth(scale);
                _x = x + (totalW / 2 - width / 2);
            }
            return obj.render(_x, y, scale);
        },
        doGetRealHeight: function(items, scale, raw) {
            var yup;
            var yoff = 0;
            var groups = Euterpe.getGroups(this.items);
            var isGroupFirst = function(item) {
                return _.find(groups, function(o) {
                    return o.first === item.id;
                });
            };
            var isGroupLast = function(item) {
                return _.find(groups, function(o) {
                    return o.last === item.id;
                });
            };
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var h = item.getRealHeight(scale, true);
                if (isGroupFirst(item)) {
                    h[0] += this.bracketExtraUp * scale;
                }
                if (isGroupLast(item)) {
                    h[1] += this.bracketExtraDown * scale;
                }
                var rh = h[1] + h[0];
                if (typeof yup === "undefined") {
                    yup = h[0] + yoff;
                }
                yoff += rh + this.lineMargin * scale;
            }
            if (raw) {
                return [ yup, yoff - yup ];
            } else {
                return yoff;
            }
        },
        renderBracket: function(x, y, scale, rows) {
            var exUp = this.bracketExtraUp * scale;
            var exDown = this.bracketExtraDown * scale;
            var h = this.doGetRealHeight(rows, scale, true);
            var up = h[0] - exUp;
            var down = h[1] - exDown - this.lineMargin * scale;
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    var xoff = 10 * scale;
                    ctx.moveTo(x + xoff, y - up - exUp);
                    ctx.lineTo(x, y - up);
                    ctx.lineTo(x, y + down);
                    ctx.lineTo(x + xoff, y + down + exDown);
                    ctx.lineTo(x + xoff / 5, y + down);
                    ctx.lineTo(x + xoff / 5, y - up);
                    ctx.lineTo(x + xoff, y - up - exUp);
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        }
    });
    return Score;
}();

Euterpe.Note = function() {
    function Note(config) {
        this.type = Euterpe.getConfig(config, "type", "quarter");
        this.beamDir = Euterpe.getConfig(config, "beamDirection", undefined);
        this.flags = Euterpe.getConfig(config, "flags", 0);
        this.dots = Euterpe.getConfig(config, "dots", 0);
        this.beam = undefined;
        Note.super.call(this, "Euterpe.Note", config);
        this.headHeight = 13.3;
        this.realHeight = [ this.headHeight / 2, this.headHeight / 2 ];
        if (this.type === "whole") {
            this.realWidth = this.headWidth = 21.2;
        } else {
            this.realWidth = this.headWidth = 13.6;
        }
        this.dotWidth = 4.5;
        this.dotMargin = 2.5;
        this.calculateSize();
    }
    Euterpe.extend(Euterpe.Node, Note, {
        beamRealHeight: 35,
        calculateSize: function() {
            if (this.beamDir === "up") {
                this.realHeight = [ this.beamRealHeight, this.headHeight / 2 ];
            } else if (this.beamDir === "down") {
                this.realHeight = [ this.headHeight / 2, this.beamRealHeight ];
            }
            this.realWidth += (this.dotMargin + this.dotWidth) * this.dots;
            if (this.flags > 0) {
                this.realWidth += 13.3;
            }
        },
        render: function(x, y, scale) {
            this.beamWidth = 1.3 * scale;
            this.beamHeight = this.beamRealHeight * scale;
            this.scale = scale;
            this.startX = x + this.headWidth * scale / 2;
            this.startY = y;
            var rendered = [];
            switch (this.type) {
              case "whole":
                rendered = this.initWhole();
                break;

              default:
                rendered = this.initHalfQuarter();
            }
            if (this.dots > 0) {
                var yOff = 0;
                var line = this.location;
                if (line % 1 === 0) {
                    yOff = 3 * scale;
                }
                var _x = x + this.headWidth * scale;
                for (var i = this.dots; i > 0; i--) {
                    _x += this.dotMargin * scale + this.dotWidth * scale / 2;
                    rendered.push(new Kinetic.Ellipse({
                        x: _x,
                        y: this.Y - yOff,
                        radius: {
                            x: 2 * this.scale,
                            y: 2 * this.scale
                        },
                        fill: "black"
                    }));
                    _x += this.dotWidth * scale / 2;
                }
            }
            Euterpe.bind(this, rendered);
            return rendered;
        },
        initWhole: function() {
            var extEl = new Kinetic.Ellipse({
                x: this.startX,
                y: this.startY,
                radius: {
                    x: 10.5 * this.scale,
                    y: 6.5 * this.scale
                },
                fill: "black"
            });
            var intEl = new Kinetic.Ellipse({
                x: this.startX,
                y: this.startY,
                radius: {
                    x: 5.5 * this.scale,
                    y: 4 * this.scale
                },
                fill: "white"
            });
            intEl.rotation(45);
            return [ extEl, intEl ];
        },
        initHalfQuarter: function() {
            var rendered = [];
            var self = this;
            var extEl = new Kinetic.Ellipse({
                x: this.startX,
                y: this.startY,
                radius: {
                    x: 7.6 * this.scale,
                    y: 5.6 * this.scale
                },
                fill: "black"
            });
            extEl.rotation(140);
            rendered.push(extEl);
            if (this.type === "half") {
                var intEl = new Kinetic.Ellipse({
                    x: this.startX,
                    y: this.startY,
                    radius: {
                        x: 6.6 * this.scale,
                        y: 2.5 * this.scale
                    },
                    fill: "white"
                });
                intEl.rotation(140);
                rendered.push(intEl);
            }
            var bX, bY;
            if (typeof this.beamDir === "string") {
                if (this.beamDir === "up") {
                    bX = extEl.x() + extEl.width() / 2 - this.beamWidth - this.beamWidth / 3;
                    bY = extEl.y();
                    this.beam = new Kinetic.Line({
                        points: [ 0, 0, 0, -this.beamHeight ],
                        stroke: "black",
                        strokeWidth: this.beamWidth,
                        x: bX,
                        y: bY
                    });
                    rendered.push(this.beam);
                } else if (this.beamDir === "down") {
                    bX = extEl.x() - extEl.width() / 2 + this.beamWidth + this.beamWidth / 3;
                    bY = extEl.y();
                    this.beam = new Kinetic.Line({
                        points: [ 0, 0, 0, this.beamHeight ],
                        stroke: "black",
                        strokeWidth: this.beamWidth,
                        x: bX,
                        y: bY
                    });
                    rendered.push(this.beam);
                }
                if (this.flags == 1) {
                    var fx = this.beam.x();
                    var fy, flag;
                    if (this.beamDir === "up") {
                        fy = this.beam.y() - this.beamHeight;
                        flag = new Kinetic.Shape({
                            sceneFunc: function(ctx) {
                                ctx.beginPath();
                                ctx.moveTo(fx, fy);
                                ctx.bezierCurveTo(fx + 6.2 * self.scale, fy + 11.8 * self.scale, fx + 21.4 * self.scale, fy + 10.4 * self.scale, fx + 10 * self.scale, fy + 26.4 * self.scale);
                                ctx.bezierCurveTo(fx + 19.6 * self.scale, fy + 12.4 * self.scale, fx + 5.4 * self.scale, fy + 10.4 * self.scale, fx - .2 * self.scale, fy + 7.4 * self.scale);
                                ctx.closePath();
                                ctx.fillStrokeShape(this);
                            },
                            fill: "black",
                            stroke: "black",
                            strokeWidth: 0
                        });
                    } else if (this.beamDir === "down") {
                        fy = this.beam.y() + this.beamHeight;
                        flag = new Kinetic.Shape({
                            sceneFunc: function(ctx) {
                                ctx.beginPath();
                                ctx.moveTo(fx, fy);
                                ctx.bezierCurveTo(fx + 6.2 * self.scale, fy - 11.8 * self.scale, fx + 21.4 * self.scale, fy - 10.4 * self.scale, fx + 10 * self.scale, fy - 26.4 * self.scale);
                                ctx.bezierCurveTo(fx + 19.6 * self.scale, fy - 12.4 * self.scale, fx + 5.4 * self.scale, fy - 10.4 * self.scale, fx - .2 * self.scale, fy - 7.4 * self.scale);
                                ctx.closePath();
                                ctx.fillStrokeShape(this);
                            },
                            fill: "black",
                            stroke: "black",
                            strokeWidth: 0
                        });
                    }
                    rendered.push(flag);
                }
            }
            Euterpe.bind(this, rendered);
            return rendered;
        }
    });
    return Note;
}();

Euterpe.TrebleClef = function() {
    function TrebleClef(config) {
        this.realWidth = 36.8;
        config.location = 0;
        TrebleClef.super.call(this, "Euterpe.TrebleClef", config);
    }
    Euterpe.extend(Euterpe.Node, TrebleClef, {
        realHeight: [ 26.3, 82 ],
        render: function(x, y, scale) {
            this.startX = x;
            this.startY = y - 27 * scale;
            this.scale = .125 * scale;
            var self = this;
            var shape1 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.translate(self.startX, self.startY);
                    ctx.scale(self.scale, self.scale);
                    ctx.moveTo(159, 3);
                    ctx.quadraticCurveTo(129, 50, 117, 93);
                    ctx.quadraticCurveTo(107, 126, 102, 167);
                    ctx.quadraticCurveTo(101, 192, 102, 210);
                    ctx.quadraticCurveTo(107, 255, 116, 297);
                    ctx.quadraticCurveTo(63, 351, 44, 375);
                    ctx.quadraticCurveTo(24, 401, 15, 429);
                    ctx.quadraticCurveTo(2, 464, 3, 503);
                    ctx.quadraticCurveTo(5, 540, 20, 575);
                    ctx.quadraticCurveTo(29, 596, 48, 615);
                    ctx.quadraticCurveTo(62, 630, 87, 645);
                    ctx.quadraticCurveTo(113, 660, 150, 666);
                    ctx.quadraticCurveTo(177, 668, 194, 665);
                    ctx.quadraticCurveTo(204, 720, 213, 776);
                    ctx.quadraticCurveTo(216, 795, 216, 813);
                    ctx.quadraticCurveTo(203, 849, 158, 857);
                    ctx.quadraticCurveTo(132, 857, 120, 842);
                    ctx.quadraticCurveTo(152, 845, 166, 813);
                    ctx.quadraticCurveTo(165, 821, 168, 802);
                    ctx.quadraticCurveTo(166, 775, 151, 765);
                    ctx.quadraticCurveTo(132, 750, 107, 758);
                    ctx.quadraticCurveTo(86, 768, 78, 789);
                    ctx.quadraticCurveTo(71, 818, 90, 840);
                    ctx.quadraticCurveTo(105, 857, 129, 865);
                    ctx.quadraticCurveTo(149, 872, 177, 865);
                    ctx.quadraticCurveTo(194, 860, 209, 846);
                    ctx.quadraticCurveTo(231, 828, 230, 803);
                    ctx.quadraticCurveTo(221, 735, 207, 662);
                    ctx.quadraticCurveTo(248, 650, 267, 626);
                    ctx.quadraticCurveTo(293, 599, 296, 566);
                    ctx.quadraticCurveTo(300, 527, 285, 494);
                    ctx.quadraticCurveTo(270, 462, 234, 444);
                    ctx.quadraticCurveTo(215, 435, 189, 435);
                    ctx.quadraticCurveTo(177, 435, 164, 438);
                    ctx.quadraticCurveTo(155, 396, 146, 354);
                    ctx.quadraticCurveTo(183, 315, 203, 275);
                    ctx.quadraticCurveTo(219, 243, 222, 210);
                    ctx.quadraticCurveTo(227, 167, 221, 137);
                    ctx.quadraticCurveTo(213, 93, 192, 51);
                    ctx.quadraticCurveTo(180, 29, 159, 3);
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
            var shape2 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.translate(self.startX, self.startY);
                    ctx.scale(self.scale, self.scale);
                    ctx.moveTo(191, 93);
                    ctx.quadraticCurveTo(179, 83, 171, 93);
                    ctx.quadraticCurveTo(126, 162, 131, 281);
                    ctx.quadraticCurveTo(188, 239, 203, 188);
                    ctx.quadraticCurveTo(209, 162, 204, 135);
                    ctx.quadraticCurveTo(200, 111, 191, 93);
                    ctx.fillStrokeShape(this);
                },
                fill: "white",
                stroke: "white",
                strokeWidth: 0
            });
            var shape3 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.translate(self.startX, self.startY);
                    ctx.scale(self.scale, self.scale);
                    ctx.moveTo(171, 473);
                    ctx.quadraticCurveTo(188, 555, 206, 648);
                    ctx.quadraticCurveTo(237, 639, 255, 620);
                    ctx.quadraticCurveTo(283, 588, 283, 558);
                    ctx.quadraticCurveTo(285, 525, 269, 501);
                    ctx.quadraticCurveTo(252, 476, 216, 470);
                    ctx.quadraticCurveTo(194, 465, 171, 473);
                    ctx.fillStrokeShape(this);
                },
                fill: "white",
                stroke: "white",
                strokeWidth: 0
            });
            var shape4 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.translate(self.startX, self.startY);
                    ctx.scale(self.scale, self.scale);
                    ctx.moveTo(147, 446);
                    ctx.quadraticCurveTo(141, 411, 132, 369);
                    ctx.quadraticCurveTo(90, 401, 68, 435);
                    ctx.quadraticCurveTo(45, 467, 39, 503);
                    ctx.quadraticCurveTo(30, 540, 45, 576);
                    ctx.quadraticCurveTo(60, 612, 92, 633);
                    ctx.quadraticCurveTo(123, 651, 161, 654);
                    ctx.quadraticCurveTo(174, 654, 188, 653);
                    ctx.fillStrokeShape(this);
                },
                fill: "white",
                stroke: "white",
                strokeWidth: 0
            });
            var shape5 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.translate(self.startX, self.startY);
                    ctx.scale(self.scale, self.scale);
                    ctx.moveTo(147, 444);
                    ctx.quadraticCurveTo(120, 456, 101, 480);
                    ctx.quadraticCurveTo(83, 504, 84, 536);
                    ctx.quadraticCurveTo(86, 567, 107, 588);
                    ctx.quadraticCurveTo(114, 597, 126, 605);
                    ctx.quadraticCurveTo(116, 593, 107, 581);
                    ctx.quadraticCurveTo(95, 560, 99, 537);
                    ctx.quadraticCurveTo(105, 509, 132, 491);
                    ctx.quadraticCurveTo(143, 482, 164, 476);
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
            var rendered = [ shape1, shape2, shape3, shape4, shape5 ];
            Euterpe.bind(this, rendered);
            return rendered;
        }
    });
    return TrebleClef;
}();

Euterpe.Sharp = function() {
    function Sharp(config) {
        Sharp.super.call(this, "Euterpe.Sharp", config);
        this.realWidth = 9;
        this.realHeight = [ 11, 11 ];
    }
    Euterpe.extend(Euterpe.Node, Sharp, {
        render: function(x, y, scale) {
            var h = this.realHeight[0] + this.realHeight[1];
            this.startY = y - h * scale / 2 - scale;
            var width = this.realWidth * scale, height = h * scale, lineWidth = 1.5 * scale;
            var verticalLine1 = new Kinetic.Rect({
                x: this.X + width / 3.6 - lineWidth / 2,
                y: this.startY + 2 * scale,
                width: lineWidth,
                height: height,
                fill: "black",
                strokeWidth: 0
            });
            var verticalLine2 = verticalLine1.clone({
                x: this.X + width - width / 3.6 - lineWidth / 2,
                y: this.startY
            });
            var angleFactor = 4.5 * scale, _y = this.startY + height / 4 + 3 * scale;
            lineWidth = 3 * scale;
            var horizontalLine1 = new Kinetic.Line({
                points: [ this.X, _y, this.X, _y + lineWidth, this.X + width, _y + lineWidth - angleFactor, this.X + width, _y - angleFactor ],
                fill: "black",
                strokeWidth: 0,
                closed: true
            });
            _y = this.startY + height - height / 4;
            var horizontalLine2 = horizontalLine1.clone({
                points: [ this.X, _y, this.X, _y + lineWidth, this.X + width, _y + lineWidth - angleFactor, this.X + width, _y - angleFactor ]
            });
            var rendered = [ verticalLine1, verticalLine2, horizontalLine1, horizontalLine2 ];
            Euterpe.bind(this, rendered);
            return rendered;
        }
    });
    return Sharp;
}();

Euterpe.Flat = function() {
    function Flat(config) {
        this.realWidth = 12.25;
        this.realHeight = [ 16.3, 9 ];
        Flat.super.call(this, "Euterpe.Flat", config);
    }
    Euterpe.extend(Euterpe.Node, Flat, {
        render: function(x, y, scale) {
            var height = (this.realHeight[0] + this.realHeight[1]) * scale;
            this.barWidth = 1.5 * scale;
            y -= 16.25 * scale;
            var bar = new Kinetic.Line({
                points: [ 0, 0, 0, height ],
                stroke: "black",
                strokeWidth: this.barWidth,
                x: x,
                y: y
            });
            var _y = y + height;
            var _x = x + this.barWidth / 2;
            var curve1 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.moveTo(_x, _y);
                    ctx.lineTo(_x + 7 * scale, _y - 5.25 * scale);
                    ctx.bezierCurveTo(_x + 12 * scale, _y - 8.75 * scale, _x + 12.5 * scale, _y - 19.75 * scale, _x, _y - 13.75 * scale);
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
            var curve2 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();
                    ctx.moveTo(_x, _y - 1.25 * scale);
                    ctx.bezierCurveTo(_x + 9.75 * scale, _y - 6.75 * scale, _x + 8.25 * scale, _y - 17.25 * scale, _x, _y - 12.75 * scale);
                    ctx.fillStrokeShape(this);
                },
                fill: "white",
                stroke: "white",
                strokeWidth: 0
            });
            var rendered = [ bar, curve1, curve2 ];
            Euterpe.bind(this, rendered);
            return rendered;
        }
    });
    return Flat;
}();

Euterpe.Natural = function() {
    function Natural(config) {
        this.realWidth = 11.5;
        this.realHeight = [ 20.5, 21.5 ];
        Natural.super.call(this, "Euterpe.Natural", config);
    }
    Euterpe.extend(Euterpe.Node, Natural, {
        render: function(x, y, scale) {
            var vbarWidth = 1.5 * scale;
            var vbarHeight = 28 * scale;
            var hbarWidth = 10 * scale;
            var hbarHeight = 2.5 * scale;
            var off = 1.5 * scale;
            y -= vbarHeight / 2 + vbarHeight / 4;
            var vbar1 = new Kinetic.Rect({
                width: vbarWidth,
                height: vbarHeight,
                fill: "black",
                stroke: "black",
                strokeWidth: 0,
                strokeEnabled: false,
                x: x,
                y: y
            });
            var vbar2 = vbar1.clone({
                x: x + hbarWidth,
                y: y + vbarHeight / 2
            });
            var _x, _y;
            var hbar1 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    _x = x;
                    _y = y + vbarHeight / 2;
                    ctx.beginPath();
                    ctx.moveTo(_x, _y);
                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y - off);
                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y + hbarHeight);
                    ctx.lineTo(_x, _y + hbarHeight + off);
                    ctx.lineTo(_x, _y);
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0,
                strokeEnabled: false
            });
            var hbar2 = hbar1.clone({
                sceneFunc: function(ctx) {
                    _x = x;
                    _y = y + vbarHeight - hbarHeight;
                    ctx.beginPath();
                    ctx.moveTo(_x, _y);
                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y - off);
                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y + hbarHeight);
                    ctx.lineTo(_x, _y + hbarHeight + off);
                    ctx.lineTo(_x, _y);
                    ctx.fillStrokeShape(this);
                }
            });
            var assets = [ vbar1, vbar2, hbar1, hbar2 ];
            Euterpe.bind(this, assets);
            return assets;
        }
    });
    return Natural;
}();

Euterpe.TimeSignature = function() {
    function TimeSignature(config) {
        this.numerator = Euterpe.getConfig(config, "numerator", 4);
        this.denominator = Euterpe.getConfig(config, "denominator", 4);
        TimeSignature.super.call(this, config);
        this.add(new Euterpe.TimeSignatureShape(this.numerator, 0));
        this.add(new Euterpe.TimeSignatureShape(this.denominator, 2));
    }
    Euterpe.extend(Euterpe.Column, TimeSignature, {
        name: "Euterpe.TimeSignature"
    });
    return TimeSignature;
}();

Euterpe.TimeSignatureShape = function() {
    function TimeSignatureShape(digit, location) {
        this.yoffset = 2;
        var heights = {
            2: [ 0, 24 + this.yoffset ],
            4: [ 0, 24 + this.yoffset ]
        };
        this.digit = digit.toString();
        this.realWidth = 22.4;
        this.realHeight = heights[digit];
        TimeSignatureShape.super.call(this, "Euterpe.TimeSignatureShape", {
            location: location
        });
    }
    Euterpe.extend(Euterpe.Node, TimeSignatureShape, {
        render: function(x, y, scale) {
            var startY = y + this.yoffset * scale;
            var assets = [];
            if (this.digit === "2") {
                assets.push(this.shape2(x, startY, scale));
            } else if (this.digit === "4") {
                assets.push(this.shape4(x, startY, scale));
            }
            Euterpe.bind(this, assets);
            return assets;
        },
        shape2: function(x, y, scale) {
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    var _x = x + scale;
                    var _y = y - .5 * scale;
                    var scY = scale * .2, scX = scY * 1.1;
                    ctx.translate(_x, _y);
                    ctx.scale(scX, scY);
                    ctx.beginPath();
                    ctx.moveTo(96.3, 78.7);
                    ctx.bezierCurveTo(96.3, 97.7, 91.7, 123.2, 67.1, 123.2);
                    ctx.bezierCurveTo(58.1, 123.2, 51.8, 118.6, 45.9, 114.1);
                    ctx.bezierCurveTo(40.2, 109.6, 34.6, 104.8, 26.6, 104.2);
                    ctx.bezierCurveTo(17.9, 103.6, 9.9, 110.1, 9.6, 118.9);
                    ctx.lineTo(.9, 118.9);
                    ctx.bezierCurveTo(-5.4, 92.9, 23.5, 79, 41.1, 68.2);
                    ctx.bezierCurveTo(53.2, 60.6, 64.3, 47.8, 64.6, 32.6);
                    ctx.bezierCurveTo(64.8, 14.4, 56.1, 9.1, 43.3, 9.1);
                    ctx.bezierCurveTo(30, 9.1, 24.9, 12.2, 24.9, 16.7);
                    ctx.bezierCurveTo(24.9, 22.6, 40.5, 21.2, 40.5, 36.5);
                    ctx.bezierCurveTo(40.5, 45.9, 31.2, 53.5, 21.8, 53.5);
                    ctx.bezierCurveTo(11.6, 52.4, 3.1, 45.9, 3.1, 34.8);
                    ctx.bezierCurveTo(3.1, 16.7, 16.2, 0, 52.7, 0);
                    ctx.bezierCurveTo(80.4, 0, 94, 17.3, 94, 34.5);
                    ctx.bezierCurveTo(94, 66.8, 50.1, 67.9, 32, 84.4);
                    ctx.lineTo(32, 84.9);
                    ctx.bezierCurveTo(49.3, 82.1, 61.5, 86.4, 71.6, 92.3);
                    ctx.bezierCurveTo(77, 95.4, 87.8, 95.7, 87.8, 78.7);
                    ctx.lineTo(96.3, 78.7);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        },
        shape4: function(x, y, scale) {
            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    var _x = x + 17.6 * scale;
                    ctx.beginPath();
                    ctx.moveTo(_x, y);
                    ctx.lineTo(_x - 10 * scale, y);
                    ctx.bezierCurveTo(_x - 8.8 * scale, y + 6.8 * scale, _x - 10.54 * scale, y + 10.66 * scale, _x - 17.6 * scale, y + 16 * scale);
                    ctx.lineTo(_x - 17.6 * scale, y + 17 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 17 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x - 5.6 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x - 5.6 * scale, y + 23.4 * scale);
                    ctx.lineTo(_x - 5.6 * scale, y + 23.4 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 23.4 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 22.4 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 17 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 17 * scale);
                    ctx.lineTo(_x + 4.4 * scale, y + 16 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 16 * scale);
                    ctx.lineTo(_x + 2.4 * scale, y + 1.4 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 7.2 * scale);
                    ctx.lineTo(_x - 3.6 * scale, y + 16 * scale);
                    ctx.lineTo(_x - 16.6 * scale, y + 16 * scale);
                    ctx.lineTo(_x, y);
                    ctx.fillStrokeShape(this);
                },
                fill: "black",
                stroke: "black",
                strokeWidth: 0
            });
        }
    });
    return TimeSignatureShape;
}();