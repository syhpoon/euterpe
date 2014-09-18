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
     */
    function Score(config) {
        this.layer = config.layer;

        Score.super.call(this, "Euterpe.Score", config);
    }

    Euterpe.extend(Euterpe.Container, Score, {
        render: function(x, y, scale) {
            var rendered = [];

            for(var i=0; i < this.items.length; i++) {
                var row = this.items[i];

                row.parent = this;
                row.X = x;
                row.Y = y;

                rendered.push(row.render(x, y, scale));

                y += row.getRealHeight(scale, true)[1];
            }

            return rendered;
        }
    });

    return Score;
}());
