/* jslint node: true */
var generators = require('../generators');

module.exports = {
    title: 'X\'s and o\'s',
    description: 'Count the largest sequential run of the letter \'x\' that occurs in the `input` string.',
    starter: 'function countx(input) {\n\n}',
    difficulty: 2,
    parameters: [generators.String({
        prob: {
            x: 0.5
        },
    })],
    solver: function (input) {
        var longest = 0;
        var current = 0;

        for (var i = 0; i < input.length; i++) {
            if (input[i] === 'x') {
                current += 1;
            } else {
                if (current > longest) {
                    longest = current;
                }
            }
        }

        return longest;
    },
};