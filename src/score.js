/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * Top level container
 *
 * @namespace Euterpe
 */
Euterpe.Score = (function() {
    /**
     * Score object
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {Number} [config.lineMargin=0] - A margin between lines
     * @param {String} [config.title] - Score title
     * @param {String} [config.musicBy] - Music author
     * @param {String} [config.tuning] - Tuning description
     * @param {Number} [config.titleMargin=0] - Title margin
     * @param {Number} [config.musicByMargin=0] - Music by margin
     * @param {Number} [config.tuningMargin=0] - Tuning margin
     */
    function Score(config) {
        this.layer = config.layer;
        this.lineMargin = Euterpe.getConfig(config, "lineMargin", 0);
        this.titleMargin = Euterpe.getConfig(config, "titleMargin", 0);
        this.musicByMargin = Euterpe.getConfig(config, "musicByMargin", 0);
        this.tuningMargin = Euterpe.getConfig(config, "tuningMargin", 0);
        this.title = Euterpe.getConfig(config, "title", undefined);
        this.musicBy = Euterpe.getConfig(config, "musicBy", undefined);
        this.tuning = Euterpe.getConfig(config, "tuning", undefined);

        this.titleHeight = 0;
        this.musicByHeight = 0;
        this.tuningHeight = 0;

        if(typeof this.title !== 'undefined') {
            this.titleText = new Euterpe.Text({
                text: this.title,
                fontSize: 40,
                fontFamily: "Serif"
            });

            this.titleWidth = this.titleText.getRealWidth(1);
            this.titleHeight = this.titleText.getRealHeight(1);
        }

        if(typeof this.musicBy !== 'undefined') {
            this.musicByText = new Euterpe.Text({
                fontSize: 20,
                text: "Music by " + this.musicBy,
                fontFamily: "Serif"
            });

            this.musicByHeight = this.musicByText.getRealHeight(1);
        }

        if(typeof this.tuning !== 'undefined') {
            this.tuningText = new Euterpe.Text({
                fontSize: 15,
                text: this.tuning,
                fontFamily: "Serif",
                fontStyle: 'italic'
            });

            this.tuningHeight = this.tuningText.getRealHeight(1);
        }

        Score.super.call(this, "Euterpe.Score", config);
    }

    Euterpe.extend(Euterpe.Container, Score, {
        bracketExtraUp: 5,
        bracketExtraDown: 5,

        getRealHeight: function(scale, raw) {
            var h = this.doGetRealHeight(this.items, scale, raw);

            var acc = 0;

            acc += this.titleHeight * scale;
            acc += this.titleMargin * scale;
            acc += this.musicByHeight * scale;
            acc += this.musicByMargin * scale;
            acc += this.tuningHeight * scale;
            acc += this.tuningMargin * scale;

            if(raw) {
                h[0] += acc;
            }
            else {
               h += acc;
            }

            return h;
        },

        render: function(origX, y, scale) {
            var yoff = 0;
            var rendered = [];
            var i;

            // Check if there are groups out there
            var groups = Euterpe.getGroups(this.items);
            var xOff = 0;

            // Find maximum X offset
            for(i=0; i < groups.length; i++) {
                var group = groups[i];

                if(group.groupType === "bracket") {
                    if(6 > xOff) {
                        xOff = 6;
                    }
                }
            }

            origX += xOff * scale;

            var gid = 0;

            y = this.renderMeta(origX, y, scale, rendered);

            for(i=0; i < this.items.length; i++) {
                var row = this.items[i];
                var h = this.doGetRealHeight([row], scale, true);

                if(yoff !== 0) {
                    yoff += h[0];
                }

                var _y = y + yoff;

                row.Y = _y;
                row.X = origX;

                // Start bracket/brace
                if(gid < groups.length && groups[gid].first === row.id) {
                    rendered.push(this.renderBracket(origX - xOff * scale,
                                                    _y, scale, groups[gid].items));

                    gid++;
                }

                yoff += h[1];

                rendered.push(row.render(origX, _y, scale));
            }

            return rendered;
        },

        /** @private */
        renderMeta: function(x, y, scale, rendered) {
            var h = this.getRealHeight(scale, true);

            y -= h[0];

            var metaHeight = (this.titleHeight +
                              this.musicByHeight +
                              this.tuningHeight +
                              this.titleMargin +
                              this.musicByMargin +
                              this.tuningMargin
                             ) * scale;

            // Render meta info
            if(typeof this.title !== 'undefined') {
                y += this.titleHeight * scale / 2;

                rendered.push(this.renderText(this.titleText,
                    this.titleWidth, x, y, scale, true));

                y += this.titleHeight * scale / 2;
                y += this.titleMargin * scale;
            }

            if(typeof this.musicBy !== 'undefined') {
                y += this.musicByHeight * scale / 2;

                rendered.push(this.renderText(
                              this.musicByText, 0, x, y, scale));

                y += this.musicByHeight * scale / 2;
                y += this.musicByMargin * scale;
            }

            if(typeof this.tuning !== 'undefined') {
                y += this.tuningHeight * scale / 2;

                rendered.push(this.renderText(
                    this.tuningText, 0, x, y, scale));

                y += this.tuningHeight * scale / 2;
                y += this.tuningMargin * scale;
            }

            y += (h[0] - metaHeight);

            return y;
        },

        /** @private */
        renderText: function(obj, width, x, y, scale, center) {
            var _x = x;

            if(center) {
                var totalW = this.items[0].getRealWidth(scale);
                _x = x + (totalW / 2 - width / 2);
            }

            return obj.render(_x, y, scale);
        },

        /** @private */
        doGetRealHeight: function(items, scale, raw) {
            var yup;
            var yoff = 0;
            var groups = Euterpe.getGroups(this.items);

            var isGroupFirst = function(item) {
                return _.find(groups,
                    function(o) { return o.first === item.id; });
            };

            var isGroupLast = function(item) {
                return _.find(groups,
                    function(o) { return o.last === item.id; });
            };

            for(var i=0; i < items.length; i++) {
                var item = items[i];

                var h = item.getRealHeight(scale, true);

                if(isGroupFirst(item)) {
                    h[0] += this.bracketExtraUp * scale;
                }
                if(isGroupLast(item)) {
                    h[1] += this.bracketExtraDown * scale;
                }

                var rh = h[1] + h[0];

                if(typeof yup === 'undefined') {
                    yup = h[0] + yoff;
                }

                yoff += (rh + this.lineMargin * scale);
            }

            if(raw) {
                return [yup, yoff - yup];
            }
            else {
                return yoff;
            }
        },

        /** @private */
        renderBracket: function(x, y, scale, rows) {
            var exUp = this.bracketExtraUp * scale;
            var exDown = this.bracketExtraDown * scale;
            var h = this.doGetRealHeight(rows, scale, true);
            var up = h[0] - exUp;
            var down = h[1] - exDown - this.lineMargin * scale;

            return new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();

                    var xoff = 10 * scale;

                    ctx.moveTo(x + xoff, y - up - exUp);
                    ctx.lineTo(x, y - up);
                    ctx.lineTo(x, y + down);
                    ctx.lineTo(x + xoff, y + down + exDown);
                    ctx.lineTo(x + xoff / 5, y + down);
                    ctx.lineTo(x + xoff / 5, y - up);
                    ctx.lineTo(x + xoff, y - up - exUp);

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        }
    });

    return Score;
}());
