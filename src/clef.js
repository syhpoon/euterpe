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
     * Based on http://www.mobilefish.com/popupwindow/html_canvas_help_all.php?help=treble_clef
     *
     * @constructor
     */
    function TrebleClef(config) {
        this.realWidth = 36.8;

        config.location = 0;
        TrebleClef.super.call(this, "Euterpe.TrebleClef", config);
    }

    Euterpe.extend(Euterpe.Node, TrebleClef, {
        render: function(x, y, scale) {
            this.startX = x;
            this.startY = y - 27 * scale;
            this.scale = 0.125 * scale;
            var self = this;

            var shape1 = new Kinetic.Shape({
                sceneFunc: function(ctx) {
                    ctx.beginPath(); 

                    ctx.translate(self.startX, self.startY);
                    ctx.scale(self.scale,self.scale);
                    ctx.moveTo(159,3); 
                    ctx.quadraticCurveTo(129,50,117,93); 
                    ctx.quadraticCurveTo(107,126,102,167); 
                    ctx.quadraticCurveTo(101,192,102,210); 
                    ctx.quadraticCurveTo(107,255,116,297); 
                    ctx.quadraticCurveTo(63,351,44,375); 
                    ctx.quadraticCurveTo(24,401,15,429); 
                    ctx.quadraticCurveTo(2,464,3,503); 
                    ctx.quadraticCurveTo(5,540,20,575); 
                    ctx.quadraticCurveTo(29,596,48,615);  
                    ctx.quadraticCurveTo(62,630,87,645);  
                    ctx.quadraticCurveTo(113,660,150,666); 
                    ctx.quadraticCurveTo(177,668,194,665);  
                    ctx.quadraticCurveTo(204,720,213,776); 
                    ctx.quadraticCurveTo(216,795,216,813); 
                    ctx.quadraticCurveTo(203,849,158,857); 
                    ctx.quadraticCurveTo(132,857,120,842); 
                    ctx.quadraticCurveTo(152,845,166,813); 
                    ctx.quadraticCurveTo(165,821,168,802);  
                    ctx.quadraticCurveTo(166,775,151,765);  
                    ctx.quadraticCurveTo(132,750,107,758); 
                    ctx.quadraticCurveTo(86,768,78,789); 
                    ctx.quadraticCurveTo(71,818,90,840); 
                    ctx.quadraticCurveTo(105,857,129,865);  
                    ctx.quadraticCurveTo(149,872,177,865);  
                    ctx.quadraticCurveTo(194,860,209,846); 
                    ctx.quadraticCurveTo(231,828,230,803); 
                    ctx.quadraticCurveTo(221,735,207,662); 
                    ctx.quadraticCurveTo(248,650,267,626); 
                    ctx.quadraticCurveTo(293,599,296,566); 
                    ctx.quadraticCurveTo(300,527,285,494); 
                    ctx.quadraticCurveTo(270,462,234,444); 
                    ctx.quadraticCurveTo(215,435,189,435); 
                    ctx.quadraticCurveTo(177,435,164,438); 
                    ctx.quadraticCurveTo(155,396,146,354); 
                    ctx.quadraticCurveTo(183,315,203,275); 
                    ctx.quadraticCurveTo(219,243,222,210); 
                    ctx.quadraticCurveTo(227,167,221,137); 
                    ctx.quadraticCurveTo(213,93,192,51); 
                    ctx.quadraticCurveTo(180,29,159,3); 

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

            this.prepared = new Kinetic.Group();
            this.prepared.add(shape1);
            this.prepared.add(shape2);
            this.prepared.add(shape3);
            this.prepared.add(shape4);
            this.prepared.add(shape5);

            return this.prepared;
        }
    });

    return TrebleClef;
}());
