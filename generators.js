/* jslint node: true */
var seedrandom = require('seedrandom');

/**
 * Each generator accepts certain parameters and returns a function that
 * generates the specified value, keeping the specified parameters in mind.
 * Generators are likely to be invoked many times and should account for that.
 */
module.exports = {
    Integer: function (seed, min, max) {
        var rng = seedrandom(seed);

        return function () {
            min = min || 0;
            max = max || 1000;

            return Math.round(rng() * max);
        };
    },
};