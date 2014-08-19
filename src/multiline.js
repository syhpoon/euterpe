/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Multiline = (function() {
    /**
     * Join multiple lines [container]
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {String} [config.type='bracket'] - 'bracket' or 'brace'
     * @param {Number} [config.lineMargin=0] - A margin between lines
     */
    function Multiline(config) {
        this.type = Euterpe.getConfig(config, "type", "bracket");
        this.lineMargin = Euterpe.getConfig(config, "lineMargin", 0);

        if(this.type === "bracket") {
            this.joinerWidth = 6;
        }

        Multiline.super.call(this, config);

        this.name = "Euterpe.Multiline";
    }

    Euterpe.extend(Euterpe.VBox, Multiline, {
        bracketExtraUp: 5,
        bracketExtraDown: 5,

        getRealHeight: function(scale, raw) {
            var yup;
            var ydown;
            var yoff = 0;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];

                var h = item.getRealHeight(scale, true);
                var up = h[0] + yoff;
                var down = h[1] + yoff;

                if(typeof yup === 'undefined' || up < yup) {
                    yup = up;
                }

                if(typeof ydown === 'undefined' || down > ydown) {
                    ydown = down;
                }

                yoff += (h[1] + this.lineMargin * scale);
            }

            if(this.type === 'bracket') {
                yup += this.bracketExtraUp * scale;
                ydown += this.bracketExtraDown * scale;
            }

            if(raw) {
                return [yup, ydown];
            }
            else {
                return Math.abs(yup + ydown);
            }
        },

        render: function(origX, y, scale) {
            var yoff = 0;
            var self = this;
            var prepared = [];

            if(this.type === "bracket") {
                prepared.push(this.renderBracket(origX, y, scale));

                origX += this.joinerWidth * scale;
            }

            var cb = function(item, x, y, scale) {
                var _y = Euterpe.getY(item, scale, y) + yoff;

                item.Y = _y;
                item.X = origX;

                yoff += (item.getRealHeight(scale, true)[1]
                         + self.lineMargin * scale);

                return item.render(origX, _y, scale);
            };

            prepared.push(this.baseRender(origX, y, scale, cb, cb));

            return prepared;
        },

        /** @private **/
        renderBracket: function(x, y, scale) {
            var exUp = this.bracketExtraUp * scale;
            var exDown = this.bracketExtraDown * scale;
            var h = this.getRealHeight(scale, true);
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

    return Multiline;
}());