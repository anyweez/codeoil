/* jslint node: true */
var generators = require('../generators');

module.exports = {
    id: 1,
    title: 'First practice problem',
    description: 'The prompt for this problem, expressed in Markdown.',
    parameters: [generators.Integer(1234), generators.Integer(1235)],
    solver: function (num) {
        return num * 2;
    },
};