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
            var found = false;
            var column = 1;
            var multiline = new Euterpe.Multiline({
                type: 'bracket',
                lineMargin: 5
            });
            var mHbox = new Euterpe.HBox();
            var tHbox = new Euterpe.HBox();

            var measures = Euterpe.select("Euterpe.Measure", root);
            var add = function(tab, rawItems) {
                if(rawItems.length === 0) {
                    return;
                }
                var multi = rawItems.length > 1;
                var column = rawItems[0][1].config.column;

                var items = _.map(rawItems,
                    function(it) {
                        return new Euterpe.Text({
                            column: multi ? undefined: column,
                            leftMargin: it[1].leftMargin,
                            rightMargin: it[1].rightMargin,
                            text: it[1].config.tab_text,
                            location: it[1].config.tab_location || 0
                        });
                    });

                if(items.length === 1) {
                    items[0].config.column = column;

                    tab.add(items);
                }
                else {
                    var left = items[0].leftMargin;
                    var right = items[items.length - 1].rightMargin;

                    items[0].leftMargin = 0;
                    items[items.length - 1].rightMargin = 0;

                    tab.add(new Euterpe.VBox({
                        leftMargin: left,
                        rightMargin: right,
                        column: column,
                        items: items
                    }));
                }
            };

            for(var i=0; i < measures.length; i++) {
                var measure = measures[i];
                var tab = new Euterpe.Tab({
                    leftBarType: measure.leftBarType
                });

                var notes = Euterpe.select("Euterpe.Note", measure);
                var dist = [];
                var columns = {};

                for(var j=0; j < notes.length; j++) {
                    var note = notes[j];
                    var d = Euterpe.getDistance(measure, note, 1);

                    if(typeof columns[d] !== 'undefined') {
                        note.config.column = columns[d];
                    }
                    else {
                        note.config.column = column;
                        columns[d] = column;
                        column += 1;
                    }

                    if(typeof note.config.tab_text === "string") {
                        found = true;

                        if(dist.length > 0 && dist[dist.length-1][0] != d) {
                            add(tab, dist);

                            dist.length = 0;
                        }

                        dist.push([d, note]);
                    }
                }

                add(tab, dist);

                mHbox.add(measure);
                tHbox.add(tab);
            }

            if(found) {
                multiline.add([mHbox, tHbox]);

                root.clear();
                root.add(multiline);
            }

            return root;
        }
    });

    return PluginTab;
}());
