/* jslint node: true */
var generators = require('../generators');

module.exports = {
    id: 1,
    title: 'Sumthing from nothing',
    description: 'Find the sum of all numbers between x and y.',
    starter: 'function sum(x, y) {\n\n}',
    parameters: [generators.Integer(1234), generators.Integer(1235)],
    solver: function (num) {
        return num * 2;
    },
};