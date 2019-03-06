let mongodb = require('../models/mongodb');
module.exports = {
    queryAll: function (req, res, next) {
        mongodb.getInstance(function (db) {
            db.collection('menu').aggregate([
                {$project: {_id: 0}},
            ]).toArray(function (err, data) {
                res.send({menu: data});
            });
        });
    }
};