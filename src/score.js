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

    Euterpe.extend(Euterpe.Container, Score);

    return Score;
}());
