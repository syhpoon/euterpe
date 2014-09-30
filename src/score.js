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
            var groups = this.getGroups();

            var h = this.doGetRealHeight(this.items, scale, raw);

            for(var i=0; i < groups.length; i++) {
                var group = groups[i];

                if(group.groupType === "bracket") {
                    if(raw) {
                        h[0] += this.bracketExtraUp * scale;
                        h[1] += this.bracketExtraDown * scale;
                    }
                    else {
                        h += (this.bracketExtraUp * scale +
                              this.bracketExtraDown * scale);

                    }
                }
            }

            return h;
        },

        render: function(origX, y, scale) {
            var yoff = 0;
            var self = this;
            var rendered = [];
            var i;

            // Check if there are groups out there
            var groups = this.getGroups();
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

                var h = row.getRealHeight(scale, true);

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

                if(yoff === 0) {
                    yoff = h[1];
                }
                else {
                    yoff += h[1];
                }

                yoff += self.lineMargin * scale;

                rendered.push(row.render(origX, _y, scale));
            }

            return rendered;
        },

        /** @private */
        getGroups: function() {
            var groups = [];
            var curGroup = null;
            var curGroupType = null;
            var id = null;
            var tmp = [];

            for(var i=0; i < this.items.length; i++) {
                var row = this.items[i];

                if(typeof row.group !== 'undefined') {
                    if(curGroup !== row.group) {
                        if(curGroup !== null) {
                            groups.push({
                                first: id,
                                groupType: curGroupType,
                                items: _.clone(tmp)
                            });
                        }

                        id = row.id;
                        curGroup = row.group;
                        curGroupType = row.groupType;
                        tmp.length = 0;
                    }

                    tmp.push(row);
                }
            }

            if(tmp.length > 0) {
                groups.push({
                    first: id,
                    groupType: curGroupType,
                    items: tmp
                });
            }

            return groups;
        },

        /** @private */
        doGetRealHeight: function(items, scale, raw, groupType) {
            var yup;
            var yoff = 0;

            for(var i=0; i < items.length; i++) {
                var item = items[i];

                var h = item.getRealHeight(scale, true);
                var rh = h[1] + h[0];

                if(typeof yup === 'undefined') {
                    yup = h[0] + yoff;
                }

                yoff += (rh + this.lineMargin * scale);
            }

            if(groupType === 'bracket') {
                yup += this.bracketExtraUp * scale;
                yoff += (this.bracketExtraUp * scale +
                    this.bracketExtraDown * scale);
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
            var h = this.doGetRealHeight(rows, scale, true, "bracket");
            var up = h[0] - exUp;
            var down = h[1] - exDown;

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
