/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

Euterpe.Node = (function() {
    var Node = function(name, config) {
        this.id = Euterpe.randomString(20);
        this.name = name;
        this.config = config || {};

        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);

        Euterpe.events.setEventHandlers(this);
    };

    Node.prototype.isNode = true;

    Node.prototype.getRealWidth = function(scale, excludeMargins) {
        var margins = Euterpe.getMargins(this, scale);

        return this.realWidth * scale + (excludeMargins ? 0: margins);
    };

    Node.prototype.getRealHeight = function(scale, raw) {
        if(typeof this.realHeight === 'undefined') {
            return 0;
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

        cloned.parentContainer = this.parentContainer;

        return cloned;
    };

    return Node;
})();
