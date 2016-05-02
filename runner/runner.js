/**
 * Runners accept solving tasks from a shared queue and generate solutions as quickly
 * as possible. The goal is to have solutions generated before users submit their own
 * guesses.
 */

var QueueWorker = require('fivebeans').worker;
var aggregator = require('../aggregator');
var operations = require('../db/operations');

function SolutionHandler() {
    this.type = 'solution';
}

SolutionHandler.prototype.work = function (payload, callback) {
    console.log(payload);

    var iterations = 1000;
    var solution = require(`../solutions/${payload.challenge}`);
    var agg = aggregator();

    var parameters = solution.parameters;
    parameters.forEach(function (parameter, i) {
        parameter.seed(payload.seed + i);
    });

    for (var i = 0; i < iterations; i++) {
        // Generate a new set of params using the specified parameter generators.
        var params = parameters.map(function (param) {
            return param.next();
        });

        // console.log(params, solution.solver.apply(null, params));
        agg.add(solution.solver.apply(null, params));
    }

    operations.RegisterSolution(payload, agg.token());
    callback('success');
}

var worker = new QueueWorker({
    id: `worker-${Math.round(Math.random() * 1000)}`,
    host: 'localhost',
    port: 11300,
    handlers: {
        solution: new SolutionHandler(),
    },
    ignoreDefaults: true,
});
worker.on('warning', function (err) {
    console.error(err);
}).start(['solutions']);