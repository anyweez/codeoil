/* jslint node: true */
var generators = require('../generators');

module.exports = {
    title: 'Oddly enough',
    description: 'Determine whether a string contains an even or odd number of characters. Return `true` if odd and `false` if even.',
    starter: 'function oddlen(input) {\n\n}',
    difficulty: 1,
    parameters: [generators.String()],
    solver: function (input) {
        return (input.length % 2) !== 0;
    },
};