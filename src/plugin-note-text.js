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
     * @param {Number} config.rightMargin - Margin between text and note
     */
    var PluginNoteText = function(config) {
        this.rightMargin = Euterpe.getConfig(config, "rightMargin");

        PluginNoteText.super.call(this, "Euterpe.PluginNoteText", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginNoteText, {
        process: function(root) {
            var notes = Euterpe.select("Euterpe.Note", root);
            var self = this;

            for(var i=0; i < notes.length; i++) {
                var note = notes[i];
                var parent = note.parentContainer;

                if(typeof note.config.text === 'undefined') {
                    continue;
                }

                var txt = new Euterpe.Text({
                    text: note.config.text,
                    location: note.config.location,
                    leftMargin: note.leftMargin,
                    rightMargin: self.rightMargin
                });

                note.leftMargin = 0;

                // If note is already contained in hbox, just add
                // text inside it
                if(parent.name === 'Euterpe.HBox') {
                    parent.insertBefore(note.id, txt);
                }
                // If it's inside a vbox, put hbox above
                else if(parent.name === 'Euterpe.VBox') {
                    var b = new Euterpe.HBox({
                        leftMargin: parent.leftMargin,
                        rightMargin: parent.rightMargin,
                        items: [txt, parent]
                    });

                    parent.leftMargin = 0;
                    parent.rightMargin = 0;

                    Euterpe.replace(root, parent.id, b);
                }
                // Else need to wrap note with hbox
                else {
                    var hbox = new Euterpe.HBox({
                        items: [txt, note]
                    });

                    Euterpe.replace(root, note.id, hbox);
                }
            }

            return root;
        }
    });

    return PluginNoteText;
}());
