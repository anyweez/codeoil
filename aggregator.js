/* jslint node: true */
var sha1 = require('sha1');

/**
 * This module exports a function that creates SolutionAggregators. SA's are used for logging
 * solutions in order then generating a single unique token (one-way hash) that uniquely
 * represents the solutions. 
 *
 * This is intended to be used for validating client solutions serverside; two SA's will 
 * generate the same hash when the same solutions are provided in the same order.
 */

function SolutionAggregator() {
    this.solutions = [];

    return this;
}

SolutionAggregator.prototype.add = function (solution) {
    this.solutions.push(solution);
};

SolutionAggregator.prototype.token = function () {
    return sha1(this.solutions.join(';'));
};

module.exports = function () {
    return new SolutionAggregator();
};