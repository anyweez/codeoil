/* jslint node: true */
var marked = require('marked');

module.exports = function (id) {
    var solution = require('./solutions/' + id + '.js');

    if (solution.description.indexOf('||') > -1) {
        solution.summary = solution.description.substr(0, solution.description.indexOf('||'));
        solution.description = solution.description.replace('||', '');
    } else {
        solution.summary = solution.description;
    }
    return {
        id: id,
        path: 'solutions/' + id + '.js',
        title: solution.title,
        summary: marked(solution.summary),
        description: marked(solution.description),
        parameters: solution.parameters,
        difficulty: solution.difficulty,
        solver: solution.solver,
        starter: solution.starter,
    };
};