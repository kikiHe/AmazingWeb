const mongodb = require('mongodb');
const config = require('../config');
const assert = require('assert');

let Client;

function initPool(cb) {
    mongodb.connect(config.DB.mongodb.url, {useNewUrlParser: true}, (err, client) => {
        assert.strictEqual(null, err);
        console.log("Connected successfully to mongodb server");
        Client = client;
        if (cb && typeof(cb) === 'function') cb(Client);
    });
}

module.exports = {
    initPool: initPool,
    getInstance: (cb) => {
        if (!Client) initPool(cb);
        else if (cb && typeof(cb) === 'function') cb(Client.db(config.DB.mongodb.database));
    },
    close: (cb) => {
        if (Client) Client.close(cb);
    }
};
