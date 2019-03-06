module.exports = {
    show_reserve: function (req, res, next) {
        res.locals.nav = 'reserve';
        res.locals.h1_title = 'Make a Reservation';
        res.render('reserve', res.locals);
    },
    reserve: function (req, res, next) {
        res.render('reserve_rep', {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            date: req.body.date,
            time: req.body.time,
            person: req.body.person
        });
    }
};

