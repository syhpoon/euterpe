/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginNoteText = (function() {
    /**
     * PluginNoteText [plugin]
     * Adds attribute "text" :: string() to Euterpe.Note
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginNoteText = function(config) {
        PluginNoteText.super.call(this, "Euterpe.PluginNoteText", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginNoteText, {
        process: function(root) {
            var notes = Euterpe.select("Euterpe.Note", root);

            for(var i=0; i < notes.length; i++) {
                var note = notes[i];

                if(typeof note.config.text === 'undefined') {
                    continue;
                }

                var txt = new Euterpe.Text({
                    text: note.config.text
                });

                note.leftItems.push(txt);
            }

            return root;
        }
    });

    return PluginNoteText;
}());
