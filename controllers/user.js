let mongodb = require('../models/mongodb');
const ObjectID = require('mongodb').ObjectID;
module.exports = {
    show_register: function (req, res, next) {
        res.locals.h1_title = 'Register';
        res.render('register', res.locals);
    },
    register: function (req, res, next) {
        if (req.body.username && req.body.email && req.body.password) {
            mongodb.getInstance(function (db) {
                db.collection('user').insertOne({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    birthday: req.body.birthday,
                    gender: req.body.gender,
                    payment: req.body.payment,
                    card: req.body.card,
                    cvc: req.body.cvc,
                    card_mon: req.body.card_mon,
                    card_year: req.body.card_year,
                    role: 'user'
                }, function (err, check) {
                    if (err) {
                        console.log(err);
                        return next(err, req, res, next);
                    }
                    res.redirect('/?r=reg');
                });
            });
        }
    },
    login: function (req, res, next) {
        mongodb.getInstance(function (db) {
            db.collection('user').findOne({
                username: req.body.username,
                password: req.body.password
            }, function (err, user) {
                if (err) {
                    console.log(err);
                    err.status = 401;
                    return next(err, req, res, next);
                }
                if (user) {
                    req.session.login = true;
                    req.session.username = user.username;
                    req.session.role = user.role;
                    res.redirect('/?r=lg');
                } else {
                    res.redirect('/?r=ng');
                }
            });
        });
    },
    logout: function (req, res, next) {
        req.session.login = false;
        req.session.username = null;
        req.session.role = null;
        res.redirect('/');
    },
    manage: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            res.locals.nav = 'dashboard';
            res.locals.sidenav = 'manage';
            res.locals.h1_title = 'Manage Users';
            let rows = [], cols = [];
            mongodb.getInstance(function (db) {
                db.collection('user').find().toArray(function (err, data) {
                    if (err != null) {
                        console.log(err);
                        return next(err, req, res, next);
                    }
                    cols = ['_id', 'username', 'password', 'email', 'birthday', 'gender', 'role'];
                    for (let i = 0; i < data.length; i++) {
                        let row_data = data[i];
                        let row = {};
                        cols.forEach(function (j) {
                            if (row_data[j])
                                row[j] = row_data[j];
                            else
                                row[j] = '';
                        });
                        rows.push(row);
                    }
                    cols.shift();
                    res.render('manage', {rows: rows, cols: cols, nav: res.locals.nav});
                });
            });
        } else {
            res.redirect('/');
        }
    },
    query: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            // search
            let search = req.body.search.value;
            if (search.length !== 0) {
                let regex = new RegExp(search, "i");
                search = {$or: [{username: regex}, {password: regex}, {email: regex}, {birthday: regex}, {gender: regex}, {role: regex}]};
            }
            else search = {};
            // paging
            let aggregateArr = [{$match: search}, {$skip: Number(req.body.start)}];
            if (req.body.length !== '-1') aggregateArr.push({$limit: Number(req.body.length)});
            aggregateArr.push({
                $project: {
                    _id: 0,
                    username: {$ifNull: ['$username', '']},
                    password: {$ifNull: ['$password', '']},
                    email: {$ifNull: ['$email', '']},
                    birthday: {$ifNull: ['$birthday', '']},
                    gender: {$ifNull: ['$gender', '']},
                    role: {$ifNull: ['$role', '']},
                    DT_RowId: '$_id'
                }
            });
            // order
            if (req.body.order.length !== 0) {
                let sortDict = {};
                req.body.order.forEach(function (col) {
                    if (col.dir === 'asc') sortDict[req.body.columns[Number(col.column)].data] = 1;
                    else if (col.dir === 'desc') sortDict[req.body.columns[Number(col.column)].data] = -1;
                });
                aggregateArr.push({$sort: sortDict});
            }
            let recordsTotal = 0,
                recordsFiltered = 0;
            mongodb.getInstance(function (db) {
                db.collection('user').countDocuments({}, function (err, total) {
                    recordsTotal = total;
                    db.collection('user').countDocuments(search, function (err, filtered) {
                        recordsFiltered = filtered;
                        db.collection('user').aggregate(aggregateArr).toArray(function (err, users) {
                            if (err) {
                                console.log(err);
                                return next(err);
                            }
                            // make sure data consistent
                            let data = users.map((u) => {
                                return {
                                    username: u.username,
                                    password: u.password,
                                    email: u.email,
                                    birthday: u.birthday,
                                    gender: u.gender,
                                    role: u.role,
                                    DT_RowId: u.DT_RowId.toString()
                                }
                            });
                            res.send({
                                draw: Number(req.body.draw),
                                recordsFiltered: recordsFiltered,
                                recordsTotal: recordsTotal,
                                data: data
                            });
                        });
                    });
                });
            });
        }
        else {
            let err = new Error('No Permission');
            err.status = 401;
            return next(err);
        }
    },
    update: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            let _id = req.body.user_id ? new ObjectID(req.body.user_id) : new ObjectID();
            let new_data = {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                birthday: req.body.birthday,
                gender: req.body.gender,
                role: req.body.role
            };
            mongodb.getInstance(function (db) {
                db.collection('user').updateOne({"_id": _id}, {$set: new_data}, {
                    w: 1,
                    upsert: true
                }, function (err, record) {
                    if (err != null) {
                        console.log(err);
                        res.send({record: null});
                    }
                    else {
                        new_data['DT_RowId'] = _id.toString();
                        res.send({record: new_data});
                    }
                })
            });
        } else {
            let err = new Error('No Permission');
            err.status = 401;
            return next(err);
        }
    },
    delete: function (req, res, next) {
        if (req.session.login && req.session.username && req.session.role && req.session.role === 'admin') {
            let _id = req.body.user_id;
            mongodb.getInstance(function (db) {
                db.collection('user').deleteOne({"_id": new ObjectID(_id)}, {w: 1}, function (err, record) {
                    if (err != null || record.deletedCount !== 1) {
                        console.log(err);
                        res.send({record: null});
                    }
                    else res.send({record: {user_id: _id}});
                })
            });
        } else {
            let err = new Error('No Permission');
            err.status = 401;
            return (err);
        }
    }
};
