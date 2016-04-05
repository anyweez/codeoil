/* jslint node: true */
var seedrandom = require('seedrandom');
var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function Generator() {
    this.rng = null;
    this.properties = {};

    return this;
}

Generator.prototype.seed = function (seed) {
    this.rng = seedrandom(seed);
};

Generator.prototype.set = function (prop, val) {
    this.properties[prop] = val;
};

Generator.prototype.random = function () {
    return this.rng();
};

/**
 * Each generator accepts certain parameters and returns a function that
 * generates the specified value, keeping the specified parameters in mind.
 * Generators are likely to be invoked many times and should account for that.
 */
module.exports = {
    Integer: function (props) {
        props = props || {};

        var gen = new Generator();
        gen.set('min', props.min || 0);
        gen.set('max', props.max || 1000);
        gen.next = function () {
            return Math.round(this.random() * this.properties.max);
        };

        return gen;
    },
    String: function (props) {
        props = props || {};

        var gen = new Generator();
        gen.set('min', 0);
        gen.set('max', 25);
        gen.set('distr', props.prob);
        gen.next = function () {
            var length = this.random();
            var chars = [];
            for (var i = 0; i < length; i++) {
                chars.push(letters[this.random()]);
            }

            return chars.join('');
        };

        return gen;
    },
    NumArray: function (props) {
        props = props || {};

        var gen = new Generator();
        gen.set('distr', props.prob);
        gen.next = function () {
            var length = this.random();
            var nums = [];

            for (var i = 0; i < length; i++) {
                nums.push(this.random());
            }

            return nums;
        };

        return gen;
    }
};