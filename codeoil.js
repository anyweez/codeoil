/* jslint node: true, esnext: true */
var process = require('process');
var koa = require('koa');
var body = require('koa-body');
var send = require('koa-send');
var router = require('koa-router')();
var session = require('koa-session');
var passport = require('koa-passport');
var GitHubStrategy = require('passport-github2').Strategy;
var handlebars = require('koa-handlebars');

var Models = require('./db/models');

// Create the application and initialize the middleware.
var app = koa();

// Configure passport with the Github strategy and set up serialization and
// deserialization (basically no-ops). I'm currently building an EXTREMELY
// basic profile using only information from Github's profile. I need to
// join this with my own profile information.
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    /*
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
    */
    // TODO: fetch user data and return a custom profile
    done(null, {
      user: profile.username,
      url: profile.profileUrl,
      pic: profile._json.avatar_url,
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Enable sessions and Passport for user logins
app.keys = ['standard-secret']; // FIXME: randomize this
app.use(session(app));

app.use(passport.initialize());
app.use(passport.session());
app.use(body());

app.use(handlebars({
    root: './public',
    extension: 'html',
    viewsDir: '.',
}));

// Route for serving all practice problems.
// todo: add router.param to verify that challenge exists.
// https://github.com/alexmingoia/koa-router#module_koa-router--Router+param
router.get('/challenge/:challenge_id', function* () {
    // Require authentication.
    if (!this.isAuthenticated()) this.redirect('/');
    
    var challenge_id = this.params.challenge_id;

    function attempt() {
        return [
            challenge_id.toString(),
            Date.now().toString(),
            Math.round(Math.random() * 100000).toString()
        ].join('');
    }

    yield this.render(`solutions/html/${challenge_id}`, {
        attempt: attempt(),
        seed: Math.round(Math.random() * 10000000),
        authenticated: this.isAuthenticated() ? this.req.user : null,
    });
});

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] })
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

router.get('/logout', function (ctx) {
   this.logout();
   this.redirect('/'); 
});

router.post('/attempt', function() {
    var beacon = JSON.parse(this.request.body);
    
    Models.Attempt.sync().then(() => Models.Attempt.create({
        attempt: beacon.attempt,
        hash: beacon.hash,
        generated: false,
    }));
});

router.get('/', function* (next) {
    yield this.render('index', {
        authenticated: this.isAuthenticated() ? this.req.user : null,
    })
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