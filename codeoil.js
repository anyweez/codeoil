/* jslint node: true, esnext: true */
var koa = require('koa');
var send = require('koa-send');
var router = require('koa-router')();

// Create the application and initialize the middleware.
var app = koa();

// Route for serving all practice problems.
// todo: add router.param to verify that challenge exists.
// https://github.com/alexmingoia/koa-router#module_koa-router--Router+param
router.get('/challenge/:challenge_id', function* (next) {
    yield send(this, 'solutions/html/' + this.params.challenge_id + '.html', {
        root: __dirname + '/public',
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

app.use(function* () {
    yield send(this, this.path, {
        root: __dirname + '/public'
    });
});

app.use(function* () {
    this.body = 'Hello World';
});

console.log('Starting server');
app.listen(3000);