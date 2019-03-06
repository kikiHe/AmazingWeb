module.exports = {
    index: function (req, res, next) {
        res.locals.nav = 'home';
        if (req.query.r === 'reg') {
            res.locals.message = 'Sign Up Successfully';
        } else if (req.query.r === 'lg') {
            res.locals.message = 'Login Successfully';
        } else if (req.query.r === 'ng') {
            res.locals.message = 'Failed to Login';
        }
        res.render('index', res.locals);
    },
    menu: function (req, res, next) {
        res.locals.nav = 'menu';
        res.locals.h1_title = 'Discover Our Exclusive Menu';
        res.render('menu', res.locals);
    },
    about: function (req, res, next) {
        res.locals.nav = 'about';
        res.locals.h1_title = 'About Us';
        res.render('about', res.locals);
    },
    contact: function (req, res, next) {
        res.locals.nav = 'contact';
        res.locals.h1_title = 'Contact Us';
        res.render('contact', res.locals);
    },
    special: function (req, res, next) {
        res.locals.nav = 'special';
        res.locals.h1_title = 'Our Specialties';
        res.render('specialties', res.locals);
    },
    blog: function (req, res, next) {
        res.locals.nav = 'blog';
        res.locals.h1_title = 'Blog';
        res.render('blog', res.locals);
    }
};
