module.exports = [
    function (req, res, next) {
        const err = new Error('The page you are looking for was not found.');
        err.status = 404;
        next(err);
    },
    function (err, req, res, next) {
        err.status = err.status || 500;
        res.status(err.status);
        res.format({
            html: function () {
                res.render('error', {error: err});
            },
            json: function () {
                res.json({error: 'Not found'});
            },
            default: function () {
                res.type('txt').send('Not found');
            }
        })
    }
];