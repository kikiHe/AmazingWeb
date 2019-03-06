let mongodb = require('../models/mongodb');
const ObjectID = require('mongodb').ObjectID;

module.exports = {
    view: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            res.locals.nav = 'dashboard';
            res.locals.sidenav = 'overview';
            res.render('dashboard', {nav: res.locals.nav});
        } else {
            res.redirect('/');
        }
    },
    dishes_times: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            res.locals.nav = 'dashboard';
            res.locals.sidenav = 'dishes_times';
            res.render('dishes_times', {nav: res.locals.nav});
        } else {
            res.redirect('/');
        }
    },
    popular_flavors: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            res.locals.nav = 'dashboard';
            res.locals.sidenav = 'popular_flavors';
            res.render('popular_flavors', {nav: res.locals.nav});
        } else {
            res.redirect('/');
        }
    },
    customer_map: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            res.locals.nav = 'dashboard';
            res.locals.sidenav = 'customer_map';
            res.render('customer_map', {nav: res.locals.nav});
        } else {
            res.redirect('/');
        }
    },
    menu_order_info: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            res.locals.nav = 'menu_order_info';
            mongodb.getInstance(function (db) {
                db.collection('items_reserve_times').aggregate([
                    {
                        $group: {
                            _id: "$name",
                            date: {$push: "$date"},
                            times: {$push: "$times"}
                        }
                    },
                    {
                        $lookup: {
                            from: "menu",
                            localField: "_id",
                            foreignField: "name",
                            as: "detail"
                        }
                    },
                    {
                        $addFields: {
                            image: {$arrayElemAt: ["$detail.image_name", 0]},
                            price: {$arrayElemAt: ["$detail.price", 0]},
                            type: {$arrayElemAt: ["$detail.type", 0]},
                            amount: {$sum: "$times"},
                        }
                    },
                    {
                        $project: {
                            _id: 0, name: "$_id", image: 1, price: 1, amount: 1, type: 1, date: 1, times: 1,
                            revenue: {$multiply: ["$price", "$amount"]}
                        }
                    },
                    {
                        $sort: {
                            revenue: -1
                        }
                    }
                ]).toArray(function (err, data) {
                    if (err != null) {
                        console.log(err);
                        return next(err, req, res, next);
                    }
                    var info_list = {main: [], dessert: [], drink: []};
                    data.forEach(function (meal_info) {
                        if (meal_info.type === 'main') info_list.main.push(meal_info);
                        if (meal_info.type === 'dessert') info_list.dessert.push(meal_info);
                        if (meal_info.type === 'drink') info_list.drink.push(meal_info);
                    });
                    res.send({menu_order_info: info_list});
                })
            });
        } else {
            res.send({});
        }
    },
    total_sales_info: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            mongodb.getInstance(function (db) {
                db.collection('items_reserve_times').aggregate([
                    {
                        $group: {
                            _id: "$name",
                            times: {$push: "$times"}
                        }
                    },
                    {
                        $lookup: {
                            from: "menu",
                            localField: "_id",
                            foreignField: "name",
                            as: "detail"
                        }
                    },
                    {
                        $addFields: {
                            price: {$arrayElemAt: ["$detail.price", 0]},
                            amount: {$sum: "$times"}
                        }
                    },
                    {
                        $project: {
                            _id: 0, price: 1, amount: 1, times: 1
                        }
                    }
                ]).toArray(function (err, data) {
                    if (err != null) {
                        console.log(err);
                        return next(err, req, res, next);
                    }
                    var data_array = [];
                    data.forEach(function (meal_info) {
                        req.app.locals.range(0, 31).forEach(function (i) {
                            data_array[i] = data_array[i] || 0;
                            data_array[i] += meal_info.times[i];
                        });
                    });
                    var revenue = data.reduce((a, i) => {
                        return a + i.times.reduce((b, j) => {
                            return b + j;
                        }, 0) * i.price;
                    }, 0);
                    var past = data_array.slice(12, 24), // [650, 590, 800, 810, 560, 550, 400, 200, 890, 720, 390, 450],
                        current = data_array.slice(0, 12), // [280, 480, 400, 190, 860, 270, 900, 302, 760, 920, 550, 400],
                        goal = 2500,
                        complete = current.reduce((a, i) => {
                            return a + i
                        }, 0);
                    var total_info = {
                        title: 'Sales: Recent Two Years',
                        data: {
                            past: past,
                            current: current
                        },
                        revenue: revenue,
                        revenue_changes: 17,
                        cost: revenue * 0.1,
                        cost_changes: 0,
                        profit: revenue * 0.9,
                        profit_changes: 20,
                        complete: complete,
                        complete_changes: (complete - goal) / goal * 100
                    };
                    res.send({total_info: total_info});
                });
            });
        } else {
            res.send({});
        }
    },
    reservation_info: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            mongodb.getInstance(function (db) {
                db.collection('reservation_info').aggregate([
                    {
                        $group: {
                            _id: {num: '$num', hour: {$hour: '$timestamp'}}, count: {$sum: 1}
                        }
                    },
                    {
                        $project: {
                            _id: 0, num: '$_id.num', hour: '$_id.hour', count: 1
                        }
                    },
                    {
                        $sort: {
                            num: 1, hour: 1
                        }
                    }
                ]).toArray(function (err, data) {
                    if (err != null) {
                        console.log(err);
                        return next(err, req, res, next);
                    }
                    var reserve_array = {};
                    data.forEach(function (i) {
                        reserve_array[i.num] = reserve_array[i.num] || [];
                        reserve_array[i.num].push({hour: i.hour, count: i.count});
                    });
                    res.send({reserve_info: reserve_array});
                });
            });
        } else {
            res.send({});
        }
    },
    feedback_info: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            mongodb.getInstance(function (db) {
                db.collection('comment').aggregate([
                    {
                        $group: {
                            _id: '$type',
                            rating: {$avg: '$rating'},
                            count: {$sum: 1}
                        }
                    },
                    {
                        $project: {
                            _id: 0, type: '$_id', rating: 1, count: 1
                        }
                    }
                ]).toArray(function (err, total_stat) {
                    if (err != null) {
                        console.log(err);
                        return next(err, req, res, next);
                    }
                    db.collection('comment').aggregate([
                        {
                            $addFields: {
                                tag: {$cond: {if: {$gte: ['$rating', 3]}, then: 1, else: 0}}
                            }
                        },
                        {
                            $group: {
                                _id: {type: "$type", tag: "$tag"},
                                count: {"$sum": 1}
                            }
                        },
                        {
                            $project: {
                                _id: 0, type: '$_id.type', tag: '$_id.tag', count: 1
                            }
                        }
                    ]).toArray(function (err, type_stat) {
                        if (err != null) {
                            console.log(err);
                            return next(err, req, res, next);
                        }
                        res.send({total_stat: total_stat, type_stat: type_stat});
                    });
                });
            });
        } else {
            res.send({});
        }
    }
};