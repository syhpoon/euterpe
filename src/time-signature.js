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
     * Time signature
     *
     * @param {Number} numerator
     * @param {Number} denominator
     * @constructor
     */
    function TimeSignature(numerator, denominator) {
        if(typeof numerator === 'undefined') {
            numerator = 4;
        }

        if(typeof denominator === 'undefined') {
            denominator = 4;
        }

        TimeSignature.super.call(this, "Euterpe.TimeSignature");

        this.addNoGap(
            new Euterpe.TimeSignatureShape(numerator,
                {
                    "Euterpe.Measure": {
                        raw: function(container, _item, _y, scale) {
                            return container.line1.y() + 2 * scale;
                        }
                    }
                }));

        this.addNoGap(
            new Euterpe.TimeSignatureShape(denominator,
                {
                    "Euterpe.Measure": {
                        raw: function(container, _item, _y, scale) {
                            return container.line3.y() + 2 * scale;
                        }
                    }
                }));
    }

    Euterpe.extend(Euterpe.VAlignLeft, TimeSignature);

    return TimeSignature;
})();

