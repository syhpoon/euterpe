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
     */
    function Score(config) {
        this.layer = config.layer;
        this.lineMargin = Euterpe.getConfig(config, "lineMargin", 0);

        Score.super.call(this, "Euterpe.Score", config);
    }

    Euterpe.extend(Euterpe.Container, Score, {
        bracketExtraUp: 5,
        bracketExtraDown: 5,

        getRealHeight: function(scale, raw) {
            return this.doGetRealHeight(this.items, scale, raw);
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
