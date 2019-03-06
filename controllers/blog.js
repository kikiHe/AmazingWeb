let mongodb = require('../models/mongodb');
module.exports = {
    query_c: function (req, res, next) {
        var category = req.params.category;
        if (typeof category !== "undefined" && ['bbq', 'noodle'].indexOf(category) > -1) {
            mongodb.getInstance(function (db) {
                db.collection('blog').aggregate([
                    {$match: {tag: category}},
                    {$project: {_id: 0}},
                ]).toArray(function (err, data) {
                    res.render('page_partials/blog_entity', {blogs: data})
                });
            });
        }
    },
    query: function (req, res, next) {
        var category = req.params.category;
        var blog_id = req.params.blog_id;
        if (typeof category !== "undefined" && typeof blog_id !== "undefined") {
            res.locals.nav = 'blog';
            res.locals.h1_title = 'Single Blog';
        }
        res.render('blog_single', res.locals);
    }
};