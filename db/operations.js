var Models = require('./models');
var fivebeans = require('fivebeans');

var client = new fivebeans.client('localhost', 11300);
client.on('connect', function () {
    console.log('Connected to beanstalkd');
    client.use('solutions', function (err) {
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
    LoadOrCreateUser: function (profile) {
        /**
         * Load the user from the users table if they exist.
         */
        function LoadUser() {
            var target = null;

            return Models.User.findOne({
                where: {
                    githubId: profile.id,
                }
            }).then(function (user) {
                target = user.get({
                    plain: true,
                });

                return Models.Status.findAll({
                    where: {
                        UserId: user.id,
                    }
                });
            }).then(function (challenges) {
                target.challenges = challenges.map((challenge) => challenge.get({ plain: true }));
                return target;
            });
        }

        /**
         * Create a new user if they don't yet exist.
         */
        function CreateUser() {
            return Models.User.create({
                githubId: profile.id,
                githubUsername: profile.username,
            }).then(function (user) {
                user.challenges = [];
                return user;
            });
        }

        /**
         * Confirm whether we need to create or load depending on whether the user
         * already exists.
         */
        return Models.User.sync().then(() => Models.User.findOne({
            where: {
                githubId: profile.id,
            }
        })).then(function (user) {
            if (user) return LoadUser();
            else return CreateUser();
        });
    },
    LogAttempt: function (user, attemptId, hash) {
        // Check to see if this is a correct solution. Afterwards, insert the Attempt into
        // a separate table and provide a link from Solution => Attempt if this does indeed
        // provide a valid solution.
        //
        // This is all async; the /attempt endpoint does not return a meaningful value but
        // will update the user's profile asynchronously.
        //
        // Note to future self: this logic assumes that the solution from the task runners will
        // be available prior to the user's guess. This should be fine but worth noting...
        return Models.Solution.findOne({
            where: {
                attempt: attemptId,
                hash: hash,
            },
        }).then(function (solution) {
            // Record the attempt and potentially update the original solution if the solution and
            // the attempt match.
            return Models.Attempt.create({
                attempt: attemptId,
                hash: hash,
                correct: (solution !== null),
            }).then(function (attempt) {
                // Update this value if it's currently unset and the current attempt was correct.
                // This means that SolvedById will be set to the *first* Attempt that solved it.
                if (attempt.correct && solution.solvedById === null) {
                    solution.setCorrectAttempt(attempt);
                    solution.setSolvedBy(user);
                    
                    // Create a new record in the status table.
                    Models.Status.create({
                        challengeId: solution.challengeId,
                        status: 'SOLVED',
                        user: user,
                    });
                }
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
        }), function () { });
    },
    RegisterSolution: function (payload, hash) {
        return Models.Solution.create({
            attempt: payload.attempt,
            hash: hash,
            seed: payload.seed,
            challengeId: payload.challenge,
        });
    },
};