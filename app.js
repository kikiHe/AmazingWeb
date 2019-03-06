const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));
// create redis server
const config = require('./config');
// const RedisServer = require('redis-server'),
//     redis_server = new RedisServer(config.redis.port);
// create redis client
// const redis = require("redis"),
//     RedisClient = redis.createClient(config.redis.port, config.redis.host);
// RedisClient.on('error', function (err) {
//     console.log('Error ' + err);
//     // if redis is not running
//     redis_server.open().then((err) => {
//         if (err === null) {
//             console.log('Redis server listening on %s !', config.redis.port);
//         }
//     });
// }).on('connect', function () {
//     console.log('Redis client connecting to %s !', config.redis.port);
// });
// set session
const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
app.use(session({
    // store: new RedisStore({client: RedisClient}),
    secret: 'amazing_web',
    name: 'session_id',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));
// set view engine
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
// use moment
app.locals.moment = require('moment');
app.locals.range = require('range').range;
app.locals.util = require('util');
// set db connection
const mongodb = require('./models/mongodb');
// init db and load data
mongodb.initPool(require('./models/uploadCSV'));
// set entry router
app.use(require('./routes/main_router'));
// start server
const http = require('http'),
    server = http.createServer(app);
server.listen(config.http.port, function () {
    console.log('App listening at http://127.0.0.1:%s !', config.http.port);
});
// close db connection
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

function shutdown() {
    server.close(function () {
        console.log('Http server closed.');
        mongodb.close(function () {
            console.log('Mongodb connection closed.');
            // if (redis_server.isRunning)
            //     redis_server.close().then(function () {
            //         console.log('Redis server closed.');
            //         process.exit(0);
            //     });
            // else
            process.exit(0);
        });
    });
}