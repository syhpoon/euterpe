/**
 * Euterpe.js
 *
 * @author Max Kuznetsov <syhpoon@gmail.com>
 * @copyright MuzMates 2014-2016
 */

Euterpe.Oob = (function() {
    var Oob = function(name, startX, endX, height, config) {
        this.id = Euterpe.randomString(20);
        this.name = name;
        this.startX = startX;
        this.endX = endX;
        this.height = height;
        this.config = config;
    };

    Oob.prototype.isOob = true;

    Oob.prototype.render = function(x, y, scale, parent) {};

    return Oob;
})();
