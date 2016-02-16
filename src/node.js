/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

Euterpe.Node = (function() {
    var Node = function(name, config) {
        this.id = config.id || Euterpe.randomString(20);
        this.name = name;
        this.config = config || {};

        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);

        this.leftItems = Euterpe.getConfig(config, "leftItems", []);
        this.rightItems = Euterpe.getConfig(config, "rightItems", []);
    };

    Node.prototype.isNode = true;

    /**
     * Get the width of left items
     * @param scale
     */
    Node.prototype.getLeftWidth = function(scale) {
        return this.reduceWidth(this.leftItems, scale);
    };

    /**
     * Get the width of right items
     * @param scale
     */
    Node.prototype.getRightWidth = function(scale) {
        return this.reduceWidth(this.rightItems, scale);
    };

    Node.prototype.getRealWidth = function(scale, bare) {
        var margins = Euterpe.getMargins(this, scale);

        return this.realWidth * scale + (bare ? 0: margins);
    };

    Node.prototype.getRealHeight = function(scale, raw) {
        if(typeof this.realHeight === 'undefined') {
            return raw ? [0, 0]: 0;
        }
        else if(raw) {
            return [this.realHeight[0] * scale, this.realHeight[1] * scale];
        }
        else {
            return this.realHeight[0] * scale + this.realHeight[1] * scale;
        }
    };

    Node.prototype.clone = function() {
        var cloned =  new this.constructor(this.config);

        cloned.parent = this.parent;

        return cloned;
    };

    /** @private */
    Node.prototype.reduceWidth = function(list, scale) {
        return _.reduce(list,
            function(acc, x) {
                return acc + x.getRealWidth(scale);
            }, 0);
    };

    return Node;
})();
