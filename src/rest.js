/**
 * Euterpe.js
 *
 * @author Vladimir Baranov <baranoff.vladimir@gmail.com>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */

Euterpe.Rest = (function() {
    /**
     * Rest object
     *
     * @constructor
     * @param {Object} config - Configuration parameters
     * @param {String} [config.type="quarter"] - Pause type (long|double_whole|
     * whole|half|quarter|eighth|sixteenth|thirty-second|sixty-fourth)
     *
     **/

    function Rest(config){
        /** @public */
        this.type = Euterpe.getConfig(config, "type", "long");

        Rest.super.call(this, "Euterpe.Rest", config);

        /** @public */
        this.basicWidth = 7;

        switch (this.type){
            case "long":
                this.realWidth = this.basicWidth;
                this.realHeight = [0, 28];
                break;
            case "double_whole":
                this.realWidth = this.basicWidth;
                this.realHeight = [0, 14.5];
                break;
            case "whole":
                this.realWidth = 20;
                this.realHeight = [0, 8];
                break;
            case "half":
                this.realWidth = 20;
                this.realHeight = [6, 0];
                break;
            case "quarter":
                this.realWidth = 20;
                this.realHeight = [16.75, 22.25];
                break;
            case "eighth":
                this.realWidth = 20;
                this.realHeight = [9.5, 16.25];
                break;
            case "sixteenth":
                this.realWidth = 20;
                this.realHeight = [9.5, 30.25];
                break;
            case "thirty-second":
                this.realWidth = 25;
                this.realHeight = [9.5, 43.25];
                break;
            case "sixty-fourth":
                this.realWidth = 30;
                this.realHeight = [9.5, 55.75];
                break;
        }
    }

    Euterpe.extend(Euterpe.Node, Rest, {
        /**
         * Render object
         * @param {Number} x
         * @param {Number} y
         * @param {Number} scale
         * @returns {Kinetic.*}
         *
         */
        render: function(x, y, scale) {
            var startX = x;

            var rendered = [];

            switch(this.type) {
                case "half":
                    rendered.push(this.initHalf(startX, y, scale));
                    break;
                case "quarter":
                    rendered.push(this.initQuarter(startX, y, scale));
                    break;
                case "eighth":
                    rendered.push(this.initEighth(startX, y, scale));
                    break;
                case "sixteenth":
                    rendered.push(this.initSixteen(startX, y, scale));
                    break;
                case "thirty-second":
                    rendered.push(this.initThirtySecond(startX, y, scale));
                    break;
                case "sixty-fourth":
                    rendered.push(this.initSixtyFourth(startX, y, scale));
                    break;

                default:
                    rendered.push(this.simpleRestShape(startX, y, scale));
            }

            Euterpe.bind(this, rendered);

            return rendered;
        },

        /**
         * Make a half rest
         *
         * @private
         */
        initHalf: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);

            return this.simpleRestShape(x, y - h[0], scale);
        },

        /**
         * Make a quarter rest
         *
         * @private
         */
        initQuarter: function(x, y, scale) {
            var sc = scale * 0.125;
            var h = this.getRealHeight(scale, true);

            var startY = y - h[0];

            return new Kinetic.Shape({
                sceneFunc: function (ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);

                    ctx.beginPath();
                    ctx.moveTo(100.2, 80.7);
                    ctx.bezierCurveTo(100.2, 100.2, 61.1, 129.6, 61.1, 168.7);
                    ctx.bezierCurveTo(61.1, 183.4, 90.4, 227.5, 110.0, 251.9);
                    ctx.bezierCurveTo(100.2, 247.0, 90.4, 242.1, 75.8, 242.1);
                    ctx.bezierCurveTo(46.4, 242.1, 36.6, 266.6, 36.6, 281.3);
                    ctx.bezierCurveTo(36.6, 291.1, 46.4, 300.9, 51.3, 310.7);
                    ctx.bezierCurveTo(21.9, 291.1, 2.4, 271.5, 2.4, 251.9);
                    ctx.bezierCurveTo(2.4, 203.0, 35.8, 220.1, 60.2, 210.3);
                    ctx.bezierCurveTo(35.8, 185.9, 12.1, 149.2, 12.1, 134.5);
                    ctx.bezierCurveTo(12.1, 124.7, 41.5, 90.4, 51.3, 66.0);
                    ctx.lineTo(51.3, 51.3);
                    ctx.bezierCurveTo(51.3, 36.6, 41.5, 17.0, 36.6, 2.4);
                    ctx.bezierCurveTo(56.2, 26.8, 100.2, 70.9, 100.2, 80.7);
                    ctx.lineTo(100.2, 80.7);
                    ctx.closePath();

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        },

        /**
         * Make a eighth rest
         *
         * @private
         */
        initEighth: function(x, y, scale) {
            var sc = scale * 0.125;
            var h = this.getRealHeight(scale, true);

            var startY = y - h[0];

            return new Kinetic.Shape({
                sceneFunc: function (ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);

                    ctx.beginPath();
                    ctx.moveTo(92.9, 5.2);
                    ctx.bezierCurveTo(90.4, 14.4, 88.4, 21.5, 88.1, 21.9);
                    ctx.bezierCurveTo(84.9, 28.7, 78.5, 37.2, 73.6, 42.1);
                    ctx.bezierCurveTo(68.4, 47.3, 65.5, 48.2, 61.1, 46.5);
                    ctx.bezierCurveTo(57.4, 44.5, 56.2, 42.4, 53.8, 31.5);
                    ctx.bezierCurveTo(51.7, 23.4, 50.2, 19.0, 46.9, 15.8);
                    ctx.bezierCurveTo(38.4, 6.5, 23.8, 5.3, 12.6, 12.6);
                    ctx.bezierCurveTo(7.3, 16.2, 3.3, 21.9, 0.9, 28.0);
                    ctx.bezierCurveTo(0.0, 31.1, 0.0, 32.0, 0.0, 36.4);
                    ctx.bezierCurveTo(0.0, 40.9, 0.0, 42.4, 0.9, 44.9);
                    ctx.bezierCurveTo(3.6, 53.8, 9.3, 60.7, 18.2, 64.7);
                    ctx.bezierCurveTo(24.7, 68.0, 27.1, 68.4, 36.0, 68.4);
                    ctx.bezierCurveTo(42.5, 68.4, 44.5, 68.4, 49.8, 67.5);
                    ctx.bezierCurveTo(57.1, 66.3, 64.7, 63.9, 73.2, 61.5);
                    ctx.lineTo(78.5, 59.4);
                    ctx.lineTo(78.5, 60.7);
                    ctx.bezierCurveTo(78.0, 62.3, 44.1, 190.0, 43.7, 190.8);
                    ctx.bezierCurveTo(43.3, 192.4, 50.6, 195.6, 55.0, 195.6);
                    ctx.bezierCurveTo(59.4, 195.6, 65.9, 192.8, 66.3, 190.8);
                    ctx.bezierCurveTo(66.7, 190.4, 86.1, 106.8, 110.3, 5.1);
                    ctx.bezierCurveTo(107.1, -2.6, 98.1, -0.8, 92.9, 5.2);
                    ctx.closePath();

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        },

        /**
         * Make a sixteenth rest
         *
         * @private
         */
        initSixteen: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);
            var sc = scale * 0.125;
            var startY = y - h[0];

            return new Kinetic.Shape({
                sceneFunc: function (ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);

                    ctx.beginPath();
                    ctx.moveTo(132.4, 0.0);
                    ctx.bezierCurveTo(126.7, 0.0, 121.8, 4.5, 120.8, 9.5);
                    ctx.bezierCurveTo(118.0, 21.7, 117.1, 25.3, 116.8, 26.1);
                    ctx.bezierCurveTo(114.2, 31.6, 107.4, 42.3, 102.3, 47.8);
                    ctx.bezierCurveTo(96.7, 52.9, 94.2, 53.8, 89.5, 52.1);
                    ctx.bezierCurveTo(85.7, 50.0, 84.4, 47.8, 81.9, 36.3);
                    ctx.bezierCurveTo(79.7, 27.8, 78.0, 23.1, 74.6, 19.8);
                    ctx.bezierCurveTo(65.6, 9.9, 50.3, 8.6, 38.3, 16.3);
                    ctx.bezierCurveTo(32.8, 20.2, 28.6, 26.1, 26.0, 32.6);
                    ctx.bezierCurveTo(25.1, 35.9, 25.1, 36.8, 25.1, 41.5);
                    ctx.bezierCurveTo(25.1, 47.8, 25.6, 51.3, 28.6, 56.3);
                    ctx.bezierCurveTo(32.8, 64.9, 41.8, 71.7, 52.0, 74.2);
                    ctx.bezierCurveTo(63.1, 77.2, 81.4, 74.7, 102.3, 67.9);
                    ctx.bezierCurveTo(105.2, 66.6, 108.2, 65.7, 108.2, 65.7);
                    ctx.bezierCurveTo(108.2, 66.2, 104.8, 80.2, 101.0, 97.7);
                    ctx.bezierCurveTo(94.6, 127.5, 94.2, 129.7, 92.0, 133.4);
                    ctx.bezierCurveTo(88.6, 140.7, 81.0, 151.0, 75.8, 155.6);
                    ctx.bezierCurveTo(71.6, 159.5, 68.7, 160.3, 64.4, 158.6);
                    ctx.bezierCurveTo(60.6, 156.5, 59.2, 154.3, 56.7, 142.9);
                    ctx.bezierCurveTo(54.5, 134.3, 52.9, 129.7, 49.4, 126.2);
                    ctx.bezierCurveTo(40.5, 116.4, 25.1, 115.2, 13.2, 122.8);
                    ctx.bezierCurveTo(7.7, 126.7, 3.4, 132.6, 0.9, 139.0);
                    ctx.bezierCurveTo(0.0, 142.5, 0.0, 143.3, 0.0, 148.0);
                    ctx.bezierCurveTo(0.0, 154.3, 0.4, 157.7, 3.4, 162.8);
                    ctx.bezierCurveTo(7.7, 171.4, 16.6, 178.2, 26.9, 180.8);
                    ctx.bezierCurveTo(37.9, 183.7, 59.2, 180.8, 80.1, 173.5);
                    ctx.bezierCurveTo(82.7, 172.7, 84.4, 172.3, 84.4, 172.3);
                    ctx.bezierCurveTo(84.4, 172.7, 54.5, 306.4, 53.3, 310.7);
                    ctx.bezierCurveTo(53.3, 311.6, 53.7, 312.0, 55.4, 312.8);
                    ctx.bezierCurveTo(58.0, 314.5, 62.2, 315.9, 65.2, 315.9);
                    ctx.bezierCurveTo(68.2, 315.9, 72.4, 314.5, 75.0, 312.8);
                    ctx.bezierCurveTo(76.7, 312.0, 77.2, 311.6, 77.6, 309.4);
                    ctx.bezierCurveTo(77.6, 308.2, 100.1, 196.1, 127.9, 60.2);
                    ctx.bezierCurveTo(131.9, 40.2, 133.1, 33.9, 136.5, 17.0);
                    ctx.bezierCurveTo(137.7, 11.1, 139.7, 0.0, 132.4, 0.0);
                    ctx.closePath();

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        },

        /**
         * Make a thirty-second rest
         *
         * @private
         */
        initThirtySecond: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);
            var sc = scale * 0.125;
            var startY = y - h[0];

            return new Kinetic.Shape({
                sceneFunc: function (ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);

                    ctx.beginPath();
                    ctx.moveTo(154.4, 0.0);
                    ctx.bezierCurveTo(152.8, 0.0, 146.0, -0.0, 144.3, 7.4);
                    ctx.bezierCurveTo(141.2, 20.7, 140.5, 22.5, 138.9, 25.3);
                    ctx.bezierCurveTo(134.2, 35.1, 127.5, 44.5, 122.7, 47.5);
                    ctx.bezierCurveTo(120.2, 49.2, 118.0, 49.2, 115.1, 47.9);
                    ctx.bezierCurveTo(111.2, 45.8, 109.9, 43.6, 107.4, 32.1);
                    ctx.bezierCurveTo(105.2, 23.6, 103.6, 18.9, 100.1, 15.5);
                    ctx.bezierCurveTo(91.2, 5.7, 75.8, 4.5, 63.9, 12.1);
                    ctx.bezierCurveTo(58.4, 15.9, 54.1, 21.9, 51.6, 28.3);
                    ctx.bezierCurveTo(50.7, 31.7, 50.7, 32.5, 50.7, 37.2);
                    ctx.bezierCurveTo(50.7, 43.6, 51.1, 47.1, 54.1, 52.2);
                    ctx.bezierCurveTo(58.4, 60.7, 67.3, 67.5, 77.6, 70.0);
                    ctx.bezierCurveTo(82.3, 71.4, 94.2, 71.4, 102.3, 70.0);
                    ctx.bezierCurveTo(109.1, 68.8, 117.2, 66.6, 125.3, 64.1);
                    ctx.bezierCurveTo(129.1, 62.8, 131.7, 61.9, 132.1, 61.9);
                    ctx.bezierCurveTo(132.1, 62.3, 117.6, 126.3, 116.8, 128.4);
                    ctx.bezierCurveTo(114.2, 133.9, 107.4, 144.6, 102.3, 150.1);
                    ctx.bezierCurveTo(96.7, 155.2, 94.2, 156.1, 89.5, 154.4);
                    ctx.bezierCurveTo(85.7, 152.3, 84.4, 150.1, 81.9, 138.6);
                    ctx.bezierCurveTo(79.7, 130.1, 78.0, 125.4, 74.6, 122.1);
                    ctx.bezierCurveTo(65.6, 112.2, 50.3, 111.0, 38.3, 118.6);
                    ctx.bezierCurveTo(32.8, 122.5, 28.6, 128.4, 26.0, 134.9);
                    ctx.bezierCurveTo(25.1, 138.2, 25.1, 139.1, 25.1, 143.8);
                    ctx.bezierCurveTo(25.1, 150.1, 25.6, 153.6, 28.6, 158.7);
                    ctx.bezierCurveTo(32.8, 167.2, 41.8, 174.0, 52.0, 176.5);
                    ctx.bezierCurveTo(63.1, 179.5, 81.4, 177.0, 102.3, 170.2);
                    ctx.bezierCurveTo(105.2, 168.9, 108.2, 168.0, 108.2, 168.0);
                    ctx.bezierCurveTo(108.2, 168.5, 104.8, 182.5, 101.0, 200.0);
                    ctx.bezierCurveTo(94.6, 229.8, 94.2, 232.0, 92.0, 235.7);
                    ctx.bezierCurveTo(88.6, 243.0, 81.0, 253.3, 75.8, 258.0);
                    ctx.bezierCurveTo(71.6, 261.8, 68.7, 262.6, 64.4, 260.9);
                    ctx.bezierCurveTo(60.6, 258.8, 59.2, 256.6, 56.7, 245.2);
                    ctx.bezierCurveTo(54.5, 236.7, 52.9, 232.0, 49.4, 228.5);
                    ctx.bezierCurveTo(40.5, 218.7, 25.1, 217.5, 13.2, 225.1);
                    ctx.bezierCurveTo(7.7, 229.0, 3.4, 234.9, 0.9, 241.3);
                    ctx.bezierCurveTo(0.0, 244.8, 0.0, 245.6, 0.0, 250.3);
                    ctx.bezierCurveTo(0.0, 256.6, 0.4, 260.0, 3.4, 265.1);
                    ctx.bezierCurveTo(7.7, 273.7, 16.6, 280.5, 26.9, 283.1);
                    ctx.bezierCurveTo(37.9, 286.0, 59.2, 283.1, 80.1, 275.8);
                    ctx.bezierCurveTo(82.7, 275.0, 84.4, 274.6, 84.4, 274.6);
                    ctx.bezierCurveTo(84.4, 275.0, 54.5, 408.7, 53.3, 413.0);
                    ctx.bezierCurveTo(53.3, 413.9, 53.7, 414.3, 55.4, 415.2);
                    ctx.bezierCurveTo(58.0, 416.8, 62.2, 418.2, 65.2, 418.2);
                    ctx.bezierCurveTo(68.2, 418.2, 72.4, 416.8, 75.0, 415.2);
                    ctx.bezierCurveTo(76.7, 414.3, 77.2, 413.9, 77.6, 411.7);
                    ctx.bezierCurveTo(77.6, 410.5, 100.1, 298.4, 127.9, 162.5);
                    ctx.bezierCurveTo(141.5, 94.4, 151.4, 44.8, 158.6, 8.7);
                    ctx.bezierCurveTo(159.5, 4.3, 157.9, -0.1, 154.4, 0.0);
                    ctx.closePath();

                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        },

        /**
         * Make a sixty-fourth rest
         *
         * @private
         */
        initSixtyFourth: function(x, y, scale) {
            var h = this.getRealHeight(scale, true);
            var sc = scale * 0.125;
            var startY = y - h[0];

            return new Kinetic.Shape({
                sceneFunc: function (ctx) {
                    ctx.translate(x, startY);
                    ctx.scale(sc, sc);
                    ctx.beginPath();
                    ctx.bezierCurveTo(89.0, 2.9, 80.5, 10.6, 76.7, 21.2);
                    ctx.bezierCurveTo(75.8, 24.6, 75.8, 25.4, 75.8, 30.1);
                    ctx.bezierCurveTo(75.8, 34.8, 75.8, 36.5, 76.7, 39.1);
                    ctx.bezierCurveTo(79.7, 48.5, 85.7, 55.7, 95.0, 59.9);
                    ctx.bezierCurveTo(101.8, 63.4, 104.4, 63.8, 113.8, 63.8);
                    ctx.bezierCurveTo(120.2, 63.8, 122.7, 63.8, 127.9, 63.0);
                    ctx.bezierCurveTo(134.6, 61.7, 144.0, 59.1, 151.3, 56.6);
                    ctx.lineTo(155.9, 54.8);
                    ctx.lineTo(155.5, 56.6);
                    ctx.bezierCurveTo(155.1, 57.4, 152.1, 72.3, 148.2, 89.3);
                    ctx.bezierCurveTo(141.5, 119.2, 141.1, 120.9, 138.9, 124.7);
                    ctx.bezierCurveTo(134.2, 134.5, 127.5, 143.9, 122.7, 146.9);
                    ctx.bezierCurveTo(120.2, 148.6, 118.0, 148.6, 115.1, 147.3);
                    ctx.bezierCurveTo(111.2, 145.2, 109.9, 143.0, 107.4, 131.5);
                    ctx.bezierCurveTo(105.2, 123.0, 103.6, 118.3, 100.1, 114.9);
                    ctx.bezierCurveTo(91.2, 105.1, 75.8, 103.9, 63.9, 111.5);
                    ctx.bezierCurveTo(58.4, 115.3, 54.1, 121.3, 51.6, 127.7);
                    ctx.bezierCurveTo(50.7, 131.1, 50.7, 131.9, 50.7, 136.6);
                    ctx.bezierCurveTo(50.7, 143.0, 51.1, 146.5, 54.1, 151.6);
                    ctx.bezierCurveTo(58.4, 160.1, 67.3, 166.9, 77.6, 169.4);
                    ctx.bezierCurveTo(82.3, 170.8, 94.2, 170.8, 102.3, 169.4);
                    ctx.bezierCurveTo(109.1, 168.2, 117.2, 166.0, 125.3, 163.5);
                    ctx.bezierCurveTo(129.1, 162.3, 131.7, 161.3, 132.1, 161.3);
                    ctx.bezierCurveTo(132.1, 161.8, 117.6, 225.7, 116.8, 227.8);
                    ctx.bezierCurveTo(114.2, 233.3, 107.4, 244.0, 102.3, 249.5);
                    ctx.bezierCurveTo(96.7, 254.6, 94.2, 255.6, 89.5, 253.8);
                    ctx.bezierCurveTo(85.7, 251.7, 84.4, 249.5, 81.9, 238.0);
                    ctx.bezierCurveTo(79.7, 229.5, 78.0, 224.8, 74.6, 221.5);
                    ctx.bezierCurveTo(65.6, 211.6, 50.3, 210.4, 38.3, 218.0);
                    ctx.bezierCurveTo(32.8, 221.9, 28.6, 227.8, 26.0, 234.3);
                    ctx.bezierCurveTo(25.1, 237.6, 25.1, 238.5, 25.1, 243.2);
                    ctx.bezierCurveTo(25.1, 249.5, 25.6, 253.0, 28.6, 258.1);
                    ctx.bezierCurveTo(32.8, 266.6, 41.8, 273.4, 52.0, 275.9);
                    ctx.bezierCurveTo(63.1, 278.9, 81.4, 276.4, 102.3, 269.6);
                    ctx.bezierCurveTo(105.2, 268.3, 108.2, 267.4, 108.2, 267.4);
                    ctx.bezierCurveTo(108.2, 267.9, 104.8, 281.9, 101.0, 299.4);
                    ctx.bezierCurveTo(94.6, 329.2, 94.2, 331.4, 92.0, 335.1);
                    ctx.bezierCurveTo(88.6, 342.4, 81.0, 352.7, 75.8, 357.4);
                    ctx.bezierCurveTo(71.6, 361.2, 68.7, 362.0, 64.4, 360.3);
                    ctx.bezierCurveTo(60.6, 358.2, 59.2, 356.0, 56.7, 344.6);
                    ctx.bezierCurveTo(54.5, 336.1, 52.9, 331.4, 49.4, 328.0);
                    ctx.bezierCurveTo(40.5, 318.1, 25.1, 316.9, 13.2, 324.5);
                    ctx.bezierCurveTo(7.7, 328.4, 3.4, 334.3, 0.9, 340.7);
                    ctx.bezierCurveTo(0.0, 344.2, 0.0, 345.0, 0.0, 349.7);
                    ctx.bezierCurveTo(0.0, 356.0, 0.4, 359.4, 3.4, 364.5);
                    ctx.bezierCurveTo(7.7, 373.1, 16.6, 379.9, 26.9, 382.5);
                    ctx.bezierCurveTo(37.9, 385.4, 59.2, 382.5, 80.1, 375.2);
                    ctx.bezierCurveTo(82.7, 374.4, 84.4, 374.0, 84.4, 374.0);
                    ctx.bezierCurveTo(84.4, 374.4, 54.5, 508.1, 53.3, 512.4);
                    ctx.bezierCurveTo(53.3, 513.3, 53.7, 513.7, 55.4, 514.6);
                    ctx.bezierCurveTo(58.0, 516.2, 62.2, 517.6, 65.2, 517.6);
                    ctx.bezierCurveTo(68.2, 517.6, 72.4, 516.2, 75.0, 514.6);
                    ctx.bezierCurveTo(76.7, 513.7, 77.2, 513.3, 77.6, 511.1);
                    ctx.bezierCurveTo(77.6, 509.9, 100.1, 397.8, 127.9, 261.9);
                    ctx.bezierCurveTo(171.7, 42.9, 177.2, 14.8, 176.8, 13.9);
                    ctx.bezierCurveTo(175.6, 11.8, 173.9, 11.0, 171.3, 11.0);
                    ctx.bezierCurveTo(167.5, 11.0, 166.6, 11.8, 162.8, 19.1);
                    ctx.bezierCurveTo(157.3, 29.7, 151.7, 37.4, 147.8, 40.4);
                    ctx.bezierCurveTo(145.7, 42.1, 143.6, 42.1, 140.2, 40.8);
                    ctx.bezierCurveTo(136.4, 38.6, 135.1, 36.5, 132.5, 25.0);
                    ctx.bezierCurveTo(130.0, 13.5, 126.9, 8.4, 120.6, 4.1);
                    ctx.bezierCurveTo(114.6, 0.3, 107.0, -0.9, 100.1, 0.7);
                    ctx.closePath();
                    ctx.fillStrokeShape(this);
                },
                fill: 'black',
                stroke: 'black',
                strokeWidth: 0
            });
        },

        /**
         * Draw simple rest shape
         *
         * @private
         */
        simpleRestShape: function(x, y, scale) {
            return new Kinetic.Rect({
                x: x,
                y: y,
                width: this.getRealWidth(scale),
                height: this.getRealHeight(scale),
                fill: 'black',
                strokeWidth: 0
            });
        }
    });

    return Rest;
})();

