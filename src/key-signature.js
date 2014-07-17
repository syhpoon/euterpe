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

        KeySignature.super.call(this, config);

        var locations = {
            "sharp": [1, 2.5, -0.5, 2, 3.5, 1.5, 3],
            "flat": [3, 1.5, 3.5, 2, 4, 2.5, 4.5]
        };

        for(var i=0; i < this.amount; i++) {
            var cfg = {
                location: {
                    "Euterpe.Measure": {
                        line: locations[this.type][i]
                    }
                }
            };

            this.add(this.type === "sharp" ?
                new Euterpe.Sharp(cfg): new Euterpe.Flat(cfg));
        }
    }

    Euterpe.extend(Euterpe.HBox, KeySignature);

    return KeySignature;
})();

