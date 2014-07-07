/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Text = (function() {
    /**
     * Text node
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {String} config.text - Text to render
     * @param {String} [config.color='black'] - Text color
     * @param {String} [config.fontFamily='Arial'] - Font family
     * @param {Number} [config.fontSize=10] - Font size
     */
    function Text(config) {
        this.text = Euterpe.getConfig(config, "text");
        this.color = Euterpe.getConfig(config, "color", "black");
        this.fontFamily = Euterpe.getConfig(config, "fontFamily", "Arial");
        this.fontSize = Euterpe.getConfig(config, "fontSize", 10);

        this.realWidth = 10;

        // Dynamic width hack
        var tmp = new Kinetic.Text({
            x: 0,
            y: 0,
            text: this.text,
            fontSize: this.fontSize * scale,
            fontFamily: this.fontFamily
        });

        this.realWidth = tmp.width();
        this.realHeight = tmp.height();

        Text.super.call(this, "Euterpe.Text", config);
    }

    Euterpe.extend(Euterpe.Node, Text, {
        render: function(x, y, scale) {
            this.prepared = new Kinetic.Text({
                x: x,
                y: y - this.realHeight / 2,
                text: this.text,
                fontSize: this.fontSize * scale,
                fontFamily: this.fontFamily,
                fill: this.color
            });

            return this.prepared;
        }
    });

    return Text;
}());
