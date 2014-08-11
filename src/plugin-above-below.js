/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.PluginAboveBelow = (function() {
    /**
     * PluginAboveBelow [plugin]
     * Adds attributes above, aboveRight, below, belowRight to measures
     * Adds attributes above, below to notes
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    var PluginAboveBelow = function(config) {
        PluginAboveBelow.super.call(this, "Euterpe.PluginAboveBelow", config);
    };

    Euterpe.extend(Euterpe.Plugin, PluginAboveBelow, {
        /** @private **/
        roundLine: function(val) {
            var d, r;

            if(val < 0) {
                d = val - Math.ceil(val);

                if(d === 0) {
                    r = val;
                }
                else if(d >= -0.5) {
                    r = Math.ceil(val) - 0.5;
                }
                else {
                    r = Math.floor(val);
                }

                return r;
            }
            else {
                d = val - Math.floor(val);

                if(d === 0) {
                    r = val;
                }
                else if(d <= 0.5) {
                    r = Math.floor(val) + 0.5;
                }
                else {
                    r = Math.ceil(val);
                }

                return r;
            }
        },

        /** @private **/
        place: function(items, scale, pos, vbox, startLoc) {
            var loc = 0, prevLoc;
            var h;
            var up, down;

            if(typeof startLoc === "number") {
                prevLoc = startLoc;
            }
            else if(pos === "above") {
                prevLoc = 0;
            }
            else if(pos === "below") {
                prevLoc = 4;
            }

            for(var j=0; j < items.length; j++) {
                var item = items[j];

                h = item.getRealHeight(scale, true);
                up = h[0] / this.lineH;
                down = h[1] / this.lineH;

                if(pos === "above") {
                    loc = prevLoc - this.roundLine(down);
                    prevLoc = loc - this.roundLine(up);
                }
                else if(pos === "below") {
                    loc = prevLoc + this.roundLine(down);
                    prevLoc = loc + this.roundLine(up);
                }

                item.config.location = loc;
                vbox.add(item);
            }
        },

        process: function(root, scale) {
            this.lineH = Euterpe.global.linePadding + Euterpe.global.lineWidth;
            var measures = Euterpe.select("Euterpe.Measure", root);

            for(var i=0; i < measures.length; i++) {
                var measure = measures[i];
                var cfg = measure.config;
                var left, leftAdded = false;
                var right, rightAdded = false;

                this.processNotes(measure, scale);

                if(_.isArray(cfg.above) || _.isArray(cfg.below)) {
                    if(!left) {
                        // Margin here because of measure number
                        left = new Euterpe.VBox({
                            leftMargin: 4 * scale
                        });
                    }

                    if(cfg.above) {
                        this.place(cfg.above, scale, "above", left);
                    }

                    if(cfg.below) {
                        this.place(cfg.below, scale, "below", left);
                    }

                    if(!leftAdded) {
                        measure.items.unshift(left);
                        leftAdded = true;
                    }
                }

                if(_.isArray(cfg.aboveRight) || _.isArray(cfg.belowRight)) {
                    if(!right) {
                        right = new Euterpe.VBox({});
                    }

                    if(cfg.aboveRight) {
                        this.place(cfg.aboveRight, scale, "above", right);
                    }

                    if(cfg.belowRight) {
                        this.place(cfg.belowRight, scale, "below", right);
                    }

                    if(!rightAdded) {
                        measure.items.push(right);
                        rightAdded = true;
                    }
                }
            }

            return root;
        },

        processNotes: function(measure, scale) {
            var notes = Euterpe.select("Euterpe.Note", measure);

            for(var i=0; i < notes.length; i++) {
                var note = notes[i];
                var cfg = note.config;

                if(_.isArray(cfg.above) || _.isArray(cfg.below)) {
                    var vbox;
                    var needReplace = false;

                    if(note.parentContainer.name !== "Euterpe.VBox") {
                        vbox = new Euterpe.VBox({
                            items: [note],
                            leftMargin: note.leftMargin,
                            rightMargin: note.rightMargin
                        });

                        note.leftMargin = 0;
                        note.rightMargin = 0;
                        needReplace = true;
                    }
                    else {
                        vbox = note.parentContainer;
                    }

                    var p = Euterpe.getTopParent(note);
                    var y = Euterpe.getY(p, scale, 0);
                    var h = p.getRealHeight(scale, true);

                    if(cfg.above) {
                        var up = this.roundLine((y - h[0]) / this.lineH);

                        this.place(cfg.above, scale, "above", vbox,
                            up > 0 ? 0: up);
                    }

                    if(cfg.below) {
                        var down = this.roundLine((y + h[1]) / this.lineH);

                        this.place(cfg.below, scale, "below", vbox,
                            down < 4 ? 4: down);
                    }

                    if(needReplace) {
                        Euterpe.replace(measure, note.id, vbox);
                    }
                }
            }
        }
    });

    return PluginAboveBelow;
}());
