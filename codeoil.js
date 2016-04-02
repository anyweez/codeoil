/* jslint node: true, esnext: true */
var koa = require('koa');
var send = require('koa-send');
var router = require('koa-router')();
var handlebars = require("koa-handlebars");

// Create the application and initialize the middleware.
var app = koa();

app.use(handlebars({
    root: './public/solutions/html/',
    extension: 'html',
    viewsDir: '.',
}));

// Route for serving all practice problems.
// todo: add router.param to verify that challenge exists.
// https://github.com/alexmingoia/koa-router#module_koa-router--Router+param
router.get('/challenge/:challenge_id', function* () {
    var challenge_id = this.params.challenge_id;

    function attempt() {
        return [
            challenge_id.toString(),
            Date.now().toString(),
            Math.round(Math.random() * 100000).toString()
        ].join('');
    }

    function seed() {
        return Math.round(Math.random() * 10000000);
    }
    //    yield send(this, 'solutions/html/' + this.params.challenge_id + '.html', {
    //        root: __dirname + '/public',
    //    });
    yield this.render(challenge_id, {
        attempt: attempt(),
        seed: seed(),
    });
});

router.get('/', function* (next) {
    yield send(this, 'index.html', {
        root: __dirname + '/public',
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