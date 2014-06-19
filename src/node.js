/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

Euterpe.Node = (function() {
    var Node = function(name, config) {
        this.name = name;
        this.config = config;

        this.leftMargin = Euterpe.getConfig(config, "leftMargin", 0);
        this.rightMargin = Euterpe.getConfig(config, "rightMargin", 0);

        Euterpe.events.setEventHandlers(this);
    };

    Node.prototype.isNode = true;

    return Node;
})();
