/* jslint node: true */
var generators = require('../generators');

module.exports = {
    title: 'Sumthing from nothing',
    description: 'Find the sum of all numbers between `x` and `y`. Both `x` and `y` are positive integers.',
    starter: `function sum(x, y) {  
        var total = 0;
        var min = (x < y) ? x : y;
        var max = (x > y) ? x : y;

        for (var i = min; i <= max; i++) {
            total += i;
        }

        return total;
    }
    `,
    // starter: 'function sum(x, y) {\n  var sum = 0;\n  for (var i = x + 1; i < y; i++) {\n  sum += i;\n }\n  return sum;\n}',
    difficulty: 1,
    parameters: [generators.Integer({
        min: 0,
    }), generators.Integer({
        min: 0,
    })],
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