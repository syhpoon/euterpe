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
     * @param {Number} config.rightMargin - Margin between accidental and note
     */
    var PluginAccidentals = function(config) {
        this.rightMargin = Euterpe.getConfig(config, "rightMargin");

        PluginAccidentals.super.call(this, "Euterpe.PluginAccidentals", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginAccidentals, {
        process: function(root) {
            var notes = Euterpe.select("Euterpe.Note", root);
            var self = this;

            for(var i=0; i < notes.length; i++) {
                var note = notes[i];
                var parent = note.parentContainer;

                if(typeof note.config.sharp === 'undefined' &&
                    typeof note.config.flat === 'undefined') {
                    continue;
                }

                var acc = [];

                for(var j=0; j < parent.items.length; j++) {
                    var item = parent.items[j];

                    if(item.id === note.id) {
                        var objs = [];
                        var count = item.config.sharp || item.config.flat;

                        for(var x=0; x < count; x++) {
                            var cfg = {
                                location: note.config.location,
                                leftMargin: x === 0 ? item.leftMargin: 0,
                                rightMargin: self.rightMargin
                            };

                            if(typeof item.config.sharp !== 'undefined') {
                                objs.push(new Euterpe.Sharp(cfg));
                            }
                            else if(typeof item.config.flat !== 'undefined') {
                                objs.push(new Euterpe.Flat(cfg));
                            }
                        }

                        item.leftMargin = 0;

                        // If note is already contained in hbox, just add
                        // accidental inside it
                        if(parent.name === 'Euterpe.HBox') {
                            acc = acc.concat(objs);
                            acc.push(item);
                        }
                        // Else need to wrap note with hbox
                        else {
                            objs.push(item);

                            acc.push(new Euterpe.HBox({
                                items: objs
                            }));
                        }
                    }
                    else {
                        acc.push(item);
                    }
                }

                parent.items = acc;
            }

            return root;
        }
    });

    return PluginAccidentals;
}());
