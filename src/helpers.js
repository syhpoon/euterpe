/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * Helper utils
 *
 * @namespace Euterpe.Helpers
 */
Euterpe.helpers = {};

/**
 * Some useful routines
 */
Euterpe.helpers.events = {
    /**
     * Highlight a node
     * @param {String} from - Initial color to replace
     * @param {String} to - Color to replace with
     */
    highlight: function(from, to) {
        function over(_node, assets, state) {
            if(typeof state.fill === 'undefined') {
                state.fill = {};
            }

            if(typeof state.stroke === 'undefined') {
                state.stroke = {};
            }

            for(var i=0; i < assets.length; i++) {
                var asset = assets[i];

                if(asset.fill() === from) {
                    state.fill[asset._id] = from;
                    asset.fill(to);
                }

                if(asset.stroke() === from) {
                    state.stroke[asset._id] = from;
                    asset.stroke(to);
                }
            }

            Euterpe.global.background.draw();
            Euterpe.global.foreground.draw();
        }

        function out(_node, assets, state) {
            for(var i=0; i < assets.length; i++) {
                var asset = assets[i];

                if(typeof state.fill[asset._id] !== 'undefined') {
                    asset.fill(state.fill[asset._id]);
                }

                if(typeof state.stroke[asset._id] !== 'undefined') {
                    asset.stroke(state.stroke[asset._id]);
                }
            }

            Euterpe.global.background.draw();
            Euterpe.global.foreground.draw();
        }

        return {
            "mouseover": over,
            "mouseout": out
        }
    }
};
