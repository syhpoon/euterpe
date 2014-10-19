/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Row = (function() {
    /**
     * Row [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} config.type - Row type 'measure' or 'tab'
     * @param {String} [config.group] - Grooup id
     * @param {String} [config.groupType] - Group type 'bracket' or 'brace'
     */
    function Row(config) {
        Row.super.call(this, "Euterpe.Row", config);

        this.type = Euterpe.getConfig(config, "type");
        this.group = Euterpe.getConfig(config, "group", undefined);
        this.groupType = Euterpe.getConfig(config, "groupType", undefined);

        if(this.type === 'measure') {
            this.numberOfLines = 5;
            this.realHeight = [0, 57.3];
        }
        else if(this.type === 'tab') {
            this.numberOfLines = 6;
            this.realHeight = [0, 71.5];
        }

        this.prepared = [];
    }

    Euterpe.extend(Euterpe.Container, Row, {
        render: function(x, y, scale) {
            var rendered = [];
            var totalWidth = 0;
            var origX = x;

            for(var i=0; i < this.items.length; i++) {
                var column = this.items[i];

                column.X = x + column.leftMargin * scale;
                column.Y = y;

                rendered.push(column.render(column.X, column.Y, scale));

                var w = column.getRealWidth(scale);

                totalWidth += w;

                x += w;
            }

            rendered.push(this.renderSelf(origX, y, scale, totalWidth));

            if(this.type === "measure") {
                var lines = [];

                this.prepareLedgerLines(
                    lines,
                    Euterpe.select("Euterpe.Note", this),
                    y, scale);

                rendered.push(this.renderLedgerLines(lines, scale));
            }

            return rendered;
        },

        /** @private */
        prepareLedgerLines: function(lines, notes, y, scale) {
            for(var i=0; i < notes.length; i++) {
                var note = notes[i];

                if(typeof note.config.location === 'number') {
                    var width = note.headWidth * scale;
                    var d;

                    // Line below
                    if(note.config.location > (this.numberOfLines - 1)) {
                        d = Math.floor(note.config.location);

                        this.addLedgerLine(note, d, note.X, width, y, lines, scale);
                    }
                    // Line above
                    else if(note.config.location < 0) {
                        d = Math.ceil(note.config.location);

                        this.addLedgerLine(note, d, note.X, width, y, lines, scale);
                    }
                }
            }
        },

        /** @private **/
        addLedgerLine: function(item, pos, x, width, baseY, lines, scale) {
            var found;

            while(true) {
                if((pos > 0 && pos <= 4) || (pos === 0)) {
                    break;
                }

                found = false;

                var _y = Euterpe.getY(pos, scale, baseY);

                if(item.name === 'Euterpe.Note') {
                    // Check if this line is already defined
                    for(var i=0; i < lines.length; i++) {
                        var line = lines[i];

                        if(line[0] === x && line[1] === _y) {
                            found = true;
                            break;
                        }
                    }

                    if(!found) {
                        lines.push([x, _y, width]);
                    }
                }

                pos += (pos > 0 ? -1: 1);
            }
        },

        /** @private */
        renderLedgerLines: function(lines, scale) {
            var r = [];

            for(var i=0; i < lines.length; i++) {
                var x = lines[i][0];
                var y = lines[i][1];
                var shift = 5 * scale;
                var width = lines[i][2] + shift * 2;

                r.push(new Kinetic.Line({
                    points: [0, 0, width, 0],
                    stroke: 'black',
                    strokeWidth: Euterpe.global.lineWidth,
                    x: x - shift,
                    y: y
                }));
            }

            return r;
        },

        /** @private */
        renderSelf: function(x, y, scale, width) {
            var line1 = new Kinetic.Line({
                points: [0, 0, width, 0],
                stroke: 'black',
                strokeWidth: Euterpe.global.lineWidth,
                x: x,
                y: y
            });

            var rendered = new Kinetic.Group({});

            rendered.add(line1);

            for(var i=2; i < this.numberOfLines + 1; i++) {
                var _y = Euterpe.getY(i - 1, scale, y);

                var line = line1.clone({
                    y: _y
                });

                rendered.add(line);
            }

            return rendered;
        }
    });

    return Row;
}());
