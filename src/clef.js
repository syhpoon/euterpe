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

            var shape1 = new Kinetic.Path({
				    x: 100,
					 y: 100,
					 data: 'M128.795 459.653c-6.347 -2.27402 -7.958 -6.20602 -8.005 -19.564c-0.189003 -84.552 -43.0579 -191.842 -105.726 -264.552c-14.7589 -17.166 -15.0637 -17.396 -15.0637 -21.601c0 -0.181 0.000565514 -0.37001 0.000565514 -0.568008 c0 -4.73599 2.17894 -8.384 6.3 -10.515c1.46411 -0.731995 2.58348 -0.869003 47.9424 -0.869003c10.4061 0 23.1406 0.00700378 38.7418 0.0160065l84.8842 0.0469971l-0.141998 -11.273c-0.378998 -37.4214 -7.86301 -50.9214 -36.332 -65.7951 c-10.563 -5.5421 -12.315 -7.5315 -12.315 -14.1631c0 -5.1158 1.231 -7.4842 5.16299 -9.9474l2.321 -1.421h100.279h100.279l2.32098 1.421c3.931 2.4632 5.16299 4.8316 5.16299 9.9474c0 6.6316 -1.75299 8.621 -12.316 14.1631 c-28.468 14.8737 -35.953 28.3737 -36.332 65.7951l-0.141998 11.226h17.621c16.579 0 17.811 0.0469971 20.179 0.947006c6.02301 2.248 9.38101 8.213 9.38101 14.257c0 3.89101 -1.39102 7.815 -4.36002 10.801c-4.31 4.263 -4.642 4.31099 -25.342 4.31099h-17.763 l0.0479736 100.137c0.00802612 18.022 0.0150146 32.803 0.0150146 44.937c0 54.263 -0.140991 55.576 -0.915009 57.047c-2.14301 4.18399 -6.13599 6.32898 -10.324 6.32898c-3.68298 0 -7.517 -1.659 -10.376 -5.04999l-8.716 -9.948l-15.442 -17.289l-16.816 -18.853 l-9.66299 -10.894l-10.185 -11.416c-25.721 -28.753 -32.494 -36.427 -33.868 -38.605c-0.899994 -1.37399 -0.946991 -2.65298 -1.08899 -48.885l-0.0950012 -47.51h-67.074c-60.1019 0 -66.5127 0.0420074 -66.5127 0.687012 c0 0.0379944 0.0214005 0.0769958 0.0549011 0.117996c0.379002 0.473999 8.4316 9.56799 17.9527 20.274l52.0581 58.5l39.552 44.289l25.911 28.895l50.163 56.368l39.032 43.816c5.44699 6.11099 10.989 12.316 12.363 13.737c3.091 3.272 4.62402 6.89801 4.62402 10.27 c0 3.707 -1.853 7.10602 -5.52402 9.388l-2.32098 1.42102l-73.942 0.0950012c-13.109 0.0209961 -24.043 0.0319824 -33.14 0.0319824c-32.291 0 -41.436 -0.147003 -42.508 -0.552979zM172.303 -0.173227h-1h2h-1zM172.303 485.827h-1h2h-1z',
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });

            var shape2 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath();

                    ctx.moveTo(66.14 * self.scale, 11.28 * self.scale);

                    ctx.bezierCurveTo(
                        53.71 * self.scale, 7.42 * self.scale,
                        48.28 * self.scale, 24.28 * self.scale,
                        53.28 * self.scale, 33.14 * self.scale);

                    ctx.bezierCurveTo(
                        65.14 * self.scale, 35.14 * self.scale,
                        76 * self.scale, 17.28 * self.scale,
                        66.14 * self.scale, 11.28 * self.scale);

                    ctx.stroke();

                    //ctx.fillStrokeShape(this);
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
            //this.group.add(shape2);
            //this.group.add(shape3);
            //this.group.add(shape4);
            //this.group.add(shape5);
        }
    };

    return TrebleClef;
}());
