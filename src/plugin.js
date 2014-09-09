/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Plugin = (function() {
    var Plugin = function(name, config) {
        this.name = name;
        this.config = config || {};
    };

    Plugin.prototype.isPlugin = true;

    Plugin.prototype.process = function(item) {
        return item;
    };

    return Plugin;
})();
