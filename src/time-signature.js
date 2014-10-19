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
     * @param {Object} config
     * @param {Number} [config.numerator]
     * @param {Number} [config.denominator]
     * @constructor
     */
    function TimeSignature(config) {
        this.numerator = Euterpe.getConfig(config, "numerator", 4);
        this.denominator = Euterpe.getConfig(config, "denominator", 4);

        TimeSignature.super.call(this, config);

        this.add(new Euterpe.TimeSignatureShape(this.numerator, 0));
        this.add(new Euterpe.TimeSignatureShape(this.denominator, 2));
    }

    Euterpe.extend(Euterpe.Column, TimeSignature, {
        name: "Euterpe.TimeSignature"
    });

    return TimeSignature;
})();

