/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.StringNumber = (function() {
    /**
     * String number
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} config.string - String number (0-6)
     */
    function StringNumber(config) {
        this.string = Euterpe.getConfig(config, "string");
        this.fontSize = 10;
        this.fontFamily = "Arial";

        if(typeof this.string !== 'number' ||
            this.string < 0 || this.string > 6) {
            throw "Invalid string value";
        }
        else {
            this.string = this.string.toString();
        }

        this.textWidth = 5;
        this.textHeight = 7.6;
        this.realWidth = 21.3;
        this.realHeight = [10.65, 10.65];

        StringNumber.super.call(this, "Euterpe.StringNumber", config);
    }

    Euterpe.extend(Euterpe.Node, StringNumber, {
        render: function(x, y, scale) {
            this.prepared = new Kinetic.Group();

            this.prepared.add(new Kinetic.Circle({
                x: x,
                y: y,
                radius: 10 * scale,
                fill: 'white',
                stroke: 'black',
                strokeWidth: scale
            }));

            this.prepared.add(new Kinetic.Text({
                x: x - (this.textWidth * scale) / 2,
                y: y - (this.textHeight * scale) / 2,
                text: this.string,
                fontSize: this.fontSize * scale,
                fontFamily: this.fontFamily,
                fill: "black"
            }));

            return this.prepared;
        }
    });

    return StringNumber;
}());