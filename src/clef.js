/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.TrebleClef = (function() {
    /**
     * Treble clef
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {float} [config.x=0] - X coordinate of the upper left corner
     * @param {float} [config.y=0] - Y coordinate of the upper left corner
     * @param {float} [config.scale=1.0] - Scale factor
     *
     * Public attributes:
     *  group {Kinetic.Group()}
     */
    function TrebleClef(config) {
        this.init(config);
    }

    TrebleClef.prototype = {
        init: function(cfg) {
            this.startX = Euterpe.get_config(cfg, "x", 0);
            this.startY = Euterpe.get_config(cfg, "y", 0);
            this.scale = Euterpe.get_config(cfg, "scale", 1.0);
            var self = this;

            var shape1 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath(); 

                    //ctx.translate(self.startX, self.startY);
                    //ctx.scale(self.scale,self.scale);
                    ctx.moveTo(44.2 * self.scale, 1 * this.scale);
                    ctx.bezierCurveTo(
                        -11.6 * self.scale, 4.4 * self.scale,
                        -11.2 * self.scale, 15.6 * self.scale,
                        -7.2 * self.scale, 22.6 * self.scale);

                    ctx.bezierCurveTo(
                        -25.8 * self.scale, 37.6 * self.scale,
                        -29.4 * self.scale, 54.4 * self.scale,
                        -7.6 * self.scale, 65.2 * self.scale);

                    ctx.bezierCurveTo(
                        -15.8 * self.scale, 65.4 * self.scale,
                        -27.0 * self.scale, 39.2 * self.scale,
                        -0.2 * self.scale, 30.8 * self.scale);

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });

            var shape2 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath(); 

                    ctx.translate(self.startX,self.startY);
                    ctx.scale(self.scale,self.scale);
                    ctx.moveTo(191,93); 
                    ctx.quadraticCurveTo(179,83,171,93); 
                    ctx.quadraticCurveTo(126,162,131,281); 
                    ctx.quadraticCurveTo(188,239,203,188); 
                    ctx.quadraticCurveTo(209,162,204,135); 
                    ctx.quadraticCurveTo(200,111,191,93);  

                    ctx.fillStrokeShape(this);
                },
                fill: 'white',
                stroke: 'white',
                strokeWidth: 0
            });

            var shape3 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath(); 

                    ctx.translate(self.startX,self.startY);
                    ctx.scale(self.scale,self.scale);
                    ctx.moveTo(171,473);
                    ctx.quadraticCurveTo(188,555,206,648);  
                    ctx.quadraticCurveTo(237,639,255,620); 
                    ctx.quadraticCurveTo(283,588,283,558); 
                    ctx.quadraticCurveTo(285,525,269,501); 
                    ctx.quadraticCurveTo(252,476,216,470); 
                    ctx.quadraticCurveTo(194,465,171,473); 

                    ctx.fillStrokeShape(this);
                },
                fill: 'white',
                stroke: 'white',
                strokeWidth: 0
            });

            var shape4 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath(); 

                    ctx.translate(self.startX,self.startY);
                    ctx.scale(self.scale,self.scale);
                    ctx.moveTo(147,446);
                    ctx.quadraticCurveTo(141,411,132,369); 
                    ctx.quadraticCurveTo(90,401,68,435); 
                    ctx.quadraticCurveTo(45,467,39,503); 
                    ctx.quadraticCurveTo(30,540,45,576); 
                    ctx.quadraticCurveTo(60,612,92,633); 
                    ctx.quadraticCurveTo(123,651,161,654); 
                    ctx.quadraticCurveTo(174,654,188,653); 

                    ctx.fillStrokeShape(this);
                },
                fill: 'white',
                stroke: 'white',
                strokeWidth: 0
            });

            var shape5 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath(); 

                    ctx.translate(self.startX,self.startY);
                    ctx.scale(self.scale,self.scale);
                    ctx.moveTo(147,444);
                    ctx.quadraticCurveTo(120,456,101,480); 
                    ctx.quadraticCurveTo(83,504,84,536); 
                    ctx.quadraticCurveTo(86,567,107,588); 
                    ctx.quadraticCurveTo(114,597,126,605); 
                    ctx.quadraticCurveTo(116,593,107,581); 
                    ctx.quadraticCurveTo(95,560,99,537); 
                    ctx.quadraticCurveTo(105,509,132,491); 
                    ctx.quadraticCurveTo(143,482,164,476); 

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });

            this.group = new Kinetic.Group({});
            this.group.add(shape1);
            this.group.add(shape2);
            this.group.add(shape3);
            this.group.add(shape4);
            this.group.add(shape5);
        }
    }

    return TrebleClef;
}());
