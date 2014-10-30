/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.KeySignature = (function() {
    /**
     * Key signature [container]
     *
     * @param {Object} config
     * @param {String} config.type - Signature type: "sharp" or "flat"
     * @param {Number} config.amount - How many items to place
     * @constructor
     */
    function KeySignature(config) {
        this.type = Euterpe.getConfig(config, "type");
        this.amount = Euterpe.getConfig(config, "amount");

        if(this.type !== "sharp" && this.type !== "flat") {
            throw "Invalid type argument";
        }

        if(typeof this.amount !== "number" || this.amount < 1 || this.amount > 7) {
            throw "amount should be >= 1 and <= 7";
        }

        KeySignature.super.call(this, "Euterpe.KeySignature", config);

        var locations = {
            "sharp": [0, 1.5, -0.5, 1, 2.5, 0.5, 2],
            "flat": [2, 0.5, 2.5, 1, 3, 1.5, 3.5]
        };

        for(var i=0; i < this.amount; i++) {
            var cfg = {
                location: locations[this.type][i]
            };

            this.add(this.type === "sharp" ?
                new Euterpe.Sharp(cfg): new Euterpe.Flat(cfg));
        }
    }

    Euterpe.extend(Euterpe.Container, KeySignature);

    return KeySignature;
})();

