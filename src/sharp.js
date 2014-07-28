/**
 * Euterpe.js
 *
 * @author Vladimir Baranov <baranoff.vladimir@gmail.com>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Sharp = (function() {
    /**
     * Sharp object
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     */

    function Sharp(config) {

        Sharp.super.call(this, "Euterpe.Sharp", config);

        this.realWidth = 9;
        this.realHeight = 20;
    }

    Euterpe.extend(Euterpe.Node, Sharp, {
        render: function(x, y, scale) {

            /** @public */
            this.startX = x;

            /** @public */
            this.startY = y - this.realHeight * scale / 2 - scale;

            var width = this.realWidth * scale,
                height = this.realHeight * scale,
                lineWidth = 1.5 * scale;

            var verticalLine1= new Kinetic.Rect({
                x: this.startX + width / 3.6 - lineWidth / 2,
                y: this.startY + 2 * scale,
                width: lineWidth,
                height: height,
                fill: 'black',
                strokeWidth: 0
            });

            var verticalLine2 = verticalLine1.clone({
                x: this.startX + width - width / 3.6 - lineWidth / 2,
                y: this.startY
            });

            var angleFactor = 4.5 * scale,
                _y = this.startY + height / 4 + 3 * scale;
            lineWidth = 3 * scale;
            var horizontalLine1 = new Kinetic.Line({
                points: [
                    this.startX, _y,
                    this.startX, _y + lineWidth,
                    this.startX + width, _y + lineWidth - angleFactor,
                    this.startX + width, _y - angleFactor
                ],
                fill: 'black',
                strokeWidth: 0,
                closed: true
            });

            _y = this.startY + height - height / 4;
            var horizontalLine2 = horizontalLine1.clone({
                points: [
                    this.startX, _y,
                    this.startX, _y + lineWidth,
                    this.startX + width, _y + lineWidth - angleFactor,
                    this.startX + width, _y - angleFactor
                ]
            });

            this.prepared = new Kinetic.Group();
            this.prepared.add(verticalLine1, verticalLine2,
                horizontalLine1, horizontalLine2);

            return this.prepared;
        }
    });

    return Sharp;
}());
