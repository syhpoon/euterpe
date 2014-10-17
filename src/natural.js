/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Natural = (function() {
    /**
     * Natural accidental
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */
    function Natural(config) {
        this.realWidth = 11.5;
        this.realHeight = [20.5, 21.5];

        Natural.super.call(this, "Euterpe.Natural", config);
    }

    Euterpe.extend(Euterpe.Node, Natural, {
        render: function(x, y, scale) {
            var vbarWidth = 1.5 * scale;
            var vbarHeight = 28 * scale;
            var hbarWidth = 10 * scale;
            var hbarHeight = 2.5 * scale;
            var off = 1.5 * scale;

            y -= (vbarHeight / 2 + vbarHeight / 4);

            var vbar1 = new Kinetic.Rect({
                width: vbarWidth,
                height: vbarHeight,
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0,
                strokeEnabled: false,
                x: x,
                y: y
            });

            var vbar2 = vbar1.clone({
                x: x + hbarWidth,
                y: y + vbarHeight / 2
            });

            var _x, _y;

            var hbar1 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    _x = x;
                    _y = y + vbarHeight / 2;

                    ctx.beginPath();
                    ctx.moveTo(_x, _y);

                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y - off);
                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y + hbarHeight);
                    ctx.lineTo(_x, _y + hbarHeight + off);
                    ctx.lineTo(_x, _y);

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0,
                strokeEnabled: false
            });

            var hbar2 = hbar1.clone({
                sceneFunc: function(ctx) {
                    _x = x;
                    _y = y + vbarHeight - hbarHeight;

                    ctx.beginPath();
                    ctx.moveTo(_x, _y);

                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y - off);
                    ctx.lineTo(_x + hbarWidth + vbarWidth, _y + hbarHeight);
                    ctx.lineTo(_x, _y + hbarHeight + off);
                    ctx.lineTo(_x, _y);

                    ctx.fillStrokeShape(this);
                }
            });

            var assets = [vbar1, vbar2, hbar1, hbar2];

            Euterpe.bind(this, assets);

            return assets;
        }
    });

    return Natural;
}());
