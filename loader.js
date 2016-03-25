/* jslint node: true */
var marked = require('marked');

module.exports = function (id) {
    var solution = require('./solutions/' + id + '.js');

    return {
        id: id,
        path: 'solutions/' + id + '.js',
        title: solution.title,
        description: marked(solution.description),
        parameters: solution.parameters,
        solver: solution.solver,
    };
};