/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginTab = (function() {
    /**
     * PluginTab [plugin]
     * Adds attributes "tab_location" :: number() and
     * "tab_text" :: string() to Euterpe.Note
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginTab = function(config) {
        PluginTab.super.call(this, "Euterpe.PluginTab", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginTab, {
        process: function(root) {
            for(var i=0; i < root.items.length; i++) {
                var row = root.items[i];
                var tab = new Euterpe.Row({
                    type: "tab"
                });

                for(var j=0; j < row.items.length; j++) {
                    var col = row.items[j];

                    if(col.name == 'Euterpe.Bar') {
                        tab.add(col.clone());

                        continue;
                    }

                    var tcol = new Euterpe.Column({});
                    var notes = Euterpe.select("Euterpe.Note", col);

                    for(var z=0; z < notes.length; z++) {
                        var note = notes[z];

                        if(typeof note.config.tab_location === 'number' &&
                            typeof note.config.tab_text === 'string') {
                            row.group = i.toString();
                            row.groupType = "bracket";
                            tab.group = row.group;
                            tab.groupType = row.groupType;

                            tcol.add(new Euterpe.Text({
                                text: note.config.tab_text,
                                location: note.config.tab_location
                            }));
                        }
                    }

                    if(tab !== null && tcol.items.length > 0) {
                        tab.add(tcol);
                    }
                }

                if(typeof tab.group !== 'undefined') {
                    root.items.splice(i+1, 0, tab);
                }

            }

            return root;
        }
    });

    return PluginTab;
}());
