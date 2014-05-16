//
// Euterpe.js
//
// Max E. Kuznetsov <mek@mek.uz.ua>
// Copyright MuzMates 2014

// Params
//  * x :: float() - x coordinate of the upper left corner
//  * y :: float() - y coordinate of the upper left corner
//  * scale :: float() - stave scale

// Public object attributes:
//  * leftBar :: Kinetic.Line()
//  * line1 :: Kinetic.Line()
//  * line2 :: Kinetic.Line()
//  * line3 :: Kinetic.Line()
//  * line4 :: Kinetic.Line()
//  * line5 :: Kinetic.Line()
//  * group :: Kinetic.Group()

Euterpe.Stave = (function() {
    function Stave(config) {
        this.init(config);
    }

    Stave.prototype = {
        init: function(cfg) {
            this.scale = Euterpe.get_config(cfg, "scale", 1.0);
            this._x = Euterpe.get_config(cfg, "x", 0);
            this._y = Euterpe.get_config(cfg, "y", 0);

            this.line_padding = 13 * this.scale;
            this.line_width = 1 * this.scale;
            this.bar_width = 2 * this.scale;

            // Length of the line
            var line_length = 150;

            var start_x = this._x + (this.bar_width / 2);
            var start_y = this._y + (this.line_width / 2);

            var line2_y = start_y + this.line_padding * 1 +
                (this.line_width * 1);
            var line3_y = start_y + this.line_padding * 2 +
                (this.line_width * 2);
            var line4_y = start_y + this.line_padding * 3 +
                (this.line_width * 3);
            var line5_y = start_y + this.line_padding * 4 +
                (this.line_width * 4);

            var bar_height = this.line_padding * 4 +
                             this.line_width * 5 -
                             (this.line_width / 2);

            this.leftBar = new Kinetic.Line({
                points: [0, 0, 0, bar_height],
                stroke: 'black',
                strokeWidth: this.bar_width,
                x: start_x,
                y: this._y
            });
    
            this.line1 = new Kinetic.Line({
                points: [0, 0, line_length, 0],
                stroke: 'black',
                strokeWidth: this.line_width,
                x: start_x,
                y: start_y
            });

            this.line2 = this.line1.clone({
                y: line2_y
            });
            
            this.line3 = this.line1.clone({
                y: line3_y
            });

            this.line4 = this.line1.clone({
                y: line4_y
            });
            
            this.line5 = this.line1.clone({
                y: line5_y
            });

            this.group = new Kinetic.Group({});

            this.group.add(this.leftBar);
            this.group.add(this.line1);
            this.group.add(this.line2);
            this.group.add(this.line3);
            this.group.add(this.line4);
            this.group.add(this.line5);

            return this.group;
        }
    };

    return Stave;
}());
