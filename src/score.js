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
        getRealHeight: function(scale, raw) {
            var yup;
            var yoff = 0;

            for(var i=0; i < this.items.length; i++) {
                var item = this.items[i];

                var h = item.getRealHeight(scale, true);
                var rh = h[1] + h[0];

                if(typeof yup === 'undefined') {
                    yup = h[0] + yoff;
                }

                yoff += (rh + this.lineMargin * scale);
            }

            if(this.type === 'bracket') {
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

        render: function(origX, y, scale) {
            var yoff = 0;
            var self = this;
            var rendered = [];

            if(this.type === "bracket") {
                rendered.push(this.renderBracket(origX, y, scale));

                origX += this.joinerWidth * scale;
            }

            for(var i=0; i < this.items.length; i++) {
                var row = this.items[i];

                var h = row.getRealHeight(scale, true);

                if(yoff !== 0) {
                    yoff += h[0];
                }

                var _y = y + yoff;

                row.Y = _y;
                row.X = origX;

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
        }
    });

    return Score;
}());
