/* jslint node: true */
var generators = require('../generators');

module.exports = {
    id: 1,
    title: 'Sumthing from nothing',
    description: 'Find the sum of all numbers between x and y.',
    starter: 'function sum(x, y) {\n  var sum = 0;\n  for (var i = x + 1; i < y; i++) {\n  sum += i;\n }\n  return sum;\n}',
    parameters: [generators.Integer(1234), generators.Integer(1235)],
    solver: function (x, y) {
        var total = 0;
        var min = (x < y) ? x : y;
        var max = (x > y) ? x : y;

        for (var i = min; i <= max; i++) {
            total += i;
        }

        return total;
    },
};