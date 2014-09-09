/**
 * Euterpe.js
 *
 * @author Max E. Kuznetsov <mek@mek.uz.ua>
 * @copyright MuzMates 2014
 */

/**
 * @namespace Euterpe
 */
Euterpe.Tab = (function() {
    /**
     * Tab [container]
     *
     * @param {Object} config
     * @constructor
     */
    function Tab(config) {
        config = config || {};
        config.numberOfLines = 6;

        Tab.super.call(this, config);

        this.name = "Euterpe.Tab";
    }

    Euterpe.extend(Euterpe.Measure, Tab, {
        realHeight: [0, 71.5]
    });

    return Tab;
})();

