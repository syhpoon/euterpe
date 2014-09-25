/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginAccidentals = (function() {
    /**
     * PluginAccidentals [plugin]
     * Adds attributes "sharp", "flat" :: number() to Euterpe.Note
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginAccidentals = function(config) {
        PluginAccidentals.super.call(this, "Euterpe.PluginAccidentals", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginAccidentals, {
        process: function(root) {
            var notes = Euterpe.select("Euterpe.Note", root);

            for(var i=0; i < notes.length; i++) {
                var note = notes[i];

                if(typeof note.config.sharp === 'undefined' &&
                    typeof note.config.flat === 'undefined') {
                    continue;
                }

                var count = note.config.sharp || note.config.flat;

                for(var x=0; x < count; x++) {
                    if(typeof note.config.sharp !== 'undefined') {
                        note.leftItems.push(new Euterpe.Sharp({}));
                    }
                    else if(typeof note.config.flat !== 'undefined') {
                        note.leftItems.push(new Euterpe.Flat({}));
                    }
                }
            }

            return root;
        }
    });

    return PluginAccidentals;
}());
