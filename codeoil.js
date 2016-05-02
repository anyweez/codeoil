/* jslint node: true, esnext: true */
'use strict'
var process = require('process');
var koa = require('koa');
var body = require('koa-body');
var send = require('koa-send');
var router = require('koa-router')();
var session = require('koa-session');
var passport = require('koa-passport');
var GitHubStrategy = require('passport-github2').Strategy;
var handlebars = require('koa-handlebars');
var logger = require('koa-logger')

// var Models = require('./db/models');
var operations = require('./db/operations');

// Create the application and initialize the middleware.
var app = koa();
app.use(logger())

/**
 * Configure passport with the Github strategy and set up serialization and
 * deserialization (basically no-ops). Once we get the Github response, join
 * this with application-specific profile data.
 */
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: (process.env.CODEOIL_DEV ? 'http://localhost:3000' : 'http://climb.queencityiron.com') + '/auth/github/callback',
}, function (accessToken, refreshToken, profile, done) {
    operations.LoadOrCreateUser(profile).then(function (user) {
        user.name = profile.username;
        user.url = profile.profileUrl;
        user.pic = profile._json.avatar_url;

        done(null, user);
    });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Enable sessions and Passport for user logins
app.keys = ['standard-secret']; // FIXME: randomize this
app.use(session(app));

app.use(passport.initialize());
app.use(passport.session());
app.use(body());

/**
 * Set up Handlebars middleware so that all files served from public/ with
 * an .html extension will be processed.
 * 
 * I also define a single helper here that contains some view-specific logic.
 */
app.use(handlebars({
    root: './public',
    extension: 'html',
    viewsDir: '.',
    helpers: {
        'challengeClass': function (user, challengeId) {
            if (user === null) return 'unfinished';

            var solved = user.challenges.find(
                (challenge) => challenge.challengeId === challengeId && challenge.status == 'SOLVED'
            );

            return (solved !== undefined) ? 'finished' : 'unfinished';
        },
    },
}));

// Route for serving all practice problems.
// todo: add router.param to verify that challenge exists.
// https://github.com/alexmingoia/koa-router#module_koa-router--Router+param
router.get('/challenge/:challenge_id', function* () {
    // Require authentication.
    if (!this.isAuthenticated()) this.redirect('/');
    if (isNaN(parseInt(this.params.challenge_id))) {
        this.throw('Invalid challenge ID specified', 400);
    }

    function attempt() {
        return [
            challenge_id.toString(),
            Date.now().toString(),
            Math.round(Math.random() * 100000).toString()
        ].join('');
    }

    var challenge_id = this.params.challenge_id;
    var attempt_id = attempt();
    var seed = Math.round(Math.random() * 10000000);

    operations.Solve(challenge_id, attempt_id, seed);

    yield this.render(`solutions/html/${challenge_id}`, {
        attempt: attempt_id,
        seed: seed,
        authenticated: this.isAuthenticated() ? this.req.user : null,
    });
});

router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/auth/github/callback',
    // TODO: create the /noauth endpoint
    passport.authenticate('github', {
        successRedirect: '/success',
        failureRedirect: '/noauth',
    })
);

router.get('/success', function () {
    this.redirect('/');
})

router.get('/logout', function () {
    this.logout();
    this.redirect('/');
});

/**
 * Asynchronously log the attempt and trigger side effects (update the solution
 * record and user profile if needed).
 */
router.post('/attempt', function () {
    try {
        if (!this.isAuthenticated()) throw Exception('You must be logged in to submit an attempt.');
        var request = JSON.parse(this.request.body);

        if (request.attempt && request.hash) {
            operations.LogAttempt(this.req.user, request.attempt, request.hash);
            this.response.status = 200;
        } else {
            this.response.status = 422;
        }
    } catch (e) {
        console.error(e);
        this.response.status = 400;
    }
});

router.get('/', function* () {
    let user = null;
    if (this.isAuthenticated()) {
        user = yield operations.LoadQuestionStatuses(this.req.user); //.then(function (user) {
    }
    
    yield this.render('index', {
        authenticated: user,
    });
});

// Attach router as middleware.
app.use(router.routes());
app.use(router.allowedMethods());

// General fallback for CSS, images, and other static files. Note: this will make
// anything in the public/ directory accessible. Nothing should go in public unless
// its...well..public.
app.use(function* () {
    yield send(this, this.path, {
        root: __dirname + '/public'
    });
});

console.log('Starting server on port 3000');
app.listen(3000);