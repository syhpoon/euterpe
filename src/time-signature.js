/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.TimeSignature = (function() {
    /**
     * Time signature [container]
     *
     * @param {Number} numerator
     * @param {Number} denominator
     * @param {Object} config
     * @constructor
     */
    function TimeSignature(numerator, denominator, config) {
        if(typeof numerator === 'undefined') {
            numerator = 4;
        }

        if(typeof denominator === 'undefined') {
            denominator = 4;
        }

        TimeSignature.super.call(this, config);

        this.add(
            new Euterpe.TimeSignatureShape(numerator,
                function(scale, y) {
                        return Euterpe.getY(0, scale, y) + 2 * scale;
                }
            ));

        this.add(
            new Euterpe.TimeSignatureShape(denominator,
                function(scale, y) {
                    return Euterpe.getY(2, scale, y) + 2 * scale;
                }
            ));
    }

    Euterpe.extend(Euterpe.VBox, TimeSignature);

    return TimeSignature;
})();

