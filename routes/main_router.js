const express = require('express');
const router = express.Router();
// load sample data to locals
router.use(require('../controllers/sample_data'));
// pages routing
let _pages = require('../controllers/pages');
router.get('/', _pages.index);
router.get('/menu', _pages.menu);
router.get('/specialties', _pages.special);
router.get('/about', _pages.about);
router.get('/contact', _pages.contact);
router.get('/blog', _pages.blog);
// user routing
let _user = require('../controllers/user');
router.get('/register', _user.show_register);
router.post('/register', _user.register);
router.post('/login', _user.login);
router.get('/logout', _user.logout);
router.get('/manage', _user.manage);
router.post('/manage', _user.query);
router.put('/manage', _user.update);
router.delete('/manage', _user.delete);
// dashboard routing
let _dashboard = require('../controllers/dashboard');
router.get('/dashboard', _dashboard.view);
router.get('/menu_order_info', _dashboard.menu_order_info);
router.get('/total_sales_info', _dashboard.total_sales_info);
router.get('/reservation_info', _dashboard.reservation_info);
router.get('/feedback_info', _dashboard.feedback_info);
router.get('/dishes_times', _dashboard.dishes_times);
router.get('/popular_flavors', _dashboard.popular_flavors);
router.get('/customer_map', _dashboard.customer_map);
// menu routing
let _menu = require('../controllers/menu');
router.post('/menu', _menu.queryAll);
// blog routing
let _blog = require('../controllers/blog');
router.get('/blog/:category', _blog.query_c);
router.get('/blog/:category/:blog_id', _blog.query);
// reserve routing
let _reserve = require('../controllers/reserve');
router.get('/reserve', _reserve.show_reserve);
router.post('/reserve', _reserve.reserve);
// error handler
let _error = require('../controllers/error');
router.use(_error);
module.exports = router;
