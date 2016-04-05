/* jslint node: true */
var generators = require('../generators');

module.exports = {
    title: 'Indivisible',
    description: 'Given two arrays of numbers, find all elements of the `first` array that are evenly divisibly by all numbers in the `second` array.',
    starter: 'function indivisible(first, second) {\n\n}',
    difficulty: 2,
    parameters: [generators.NumArray(), generators.NumArray({
        prob: {
            1: 0.2,
            2: 0.2,
            3: 0.2,
            4: 0.2,
            5: 0.2,
        }
    })],
    solver: function (first, second) {
        var keeps = [];

        for (var i = 0; i < first.length; i++) {
            var keep = true;

            for (var j = 0; j < second.length; j++) {
                if (first % second[j] !== 0) {
                    keep = false;
                }
            }

            if (keep) keeps.push(first);
        }

        return keeps;
    },
};