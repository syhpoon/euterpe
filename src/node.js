/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

Euterpe.Node = (function() {
    var Node = function(name) {
        this.nodeName = name;

        Euterpe.events.setEventHandlers(this);
    };

    Node.prototype.isNode = true;

    return Node;
})();
