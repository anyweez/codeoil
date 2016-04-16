var Models = require('./models');
var fivebeans = require('fivebeans');

var client = new fivebeans.client('localhost', 11300);
client.on('connect', function () {
    client.use('solutions', function(err) {
        if (err) console.error(err);
    });
}).on('error', function (err) {
    // connection failure
    console.error('Couldn\'t connect to beanstalkd instance: ' + err);
}).on('close', function () {
    console.error('Couldn\'t connect to beanstalkd instance.');
    // underlying connection has closed
}).connect();

module.exports = {
    LogAttempt: function (attemptId, hash) {
        // Check to see if this is a correct solution. Afterwards, insert the Attempt into
        // a separate table and provide a link from Solution => Attempt if this does indeed
        // provide a valid solution.
        //
        // This is all async; the /attempt endpoint does not return a meaningful value but
        // will update the user's profile asynchronously.
        Models.Solution.sync().then(() => Models.Solution.findOne({
            where: {
                attempt: attemptId,
                hash: hash,
            },
        })).then(function (solution) {
            // Record the attempt and potentially update the original solution if the solution and
            // the attempt match.
            Models.Attempt.sync().then(() => Models.Attempt.create({
                attempt: attemptId,
                hash: hash,
                correct: (solution !== null),
            }))
                .then(function (attempt) {
                    // Update this value if it's currently unset and the current attempt was correct.
                    // This means that SolvedById will be set to the *first* Attempt that solved it.
                    if (attempt.correct && solution.SolvedById === null) solution.setSolvedBy(attempt);
                });
        });
    },
    // Submit a solution solver request to the workers.
    Solve: function (challengeId, attemptId, seed) {
        client.put(100, 0, 0, JSON.stringify({
            type: 'solution',
            payload: {
                challenge: challengeId,
                attempt: attemptId,
                seed: seed,
            },
        }), function() {});
    },
    RegisterSolution: function(attempt, hash) {
        Models.Solution.sync().then(() => Models.Solution.create({
               attempt: attempt,
               hash: hash
        }));
    },
};