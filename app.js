var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.use('/upload_image', require('./routes/upload_image'));
app.use('/upload_avatar', require('./routes/upload_avatar'));

app.use('/login', require('./routes/login'));
app.use('/list_products', require('./routes/list_products'));
app.use('/list_products', require('./routes/list_products'));
app.use('/post_product', require('./routes/post_product'));
app.use('/show_product_detail', require('./routes/show_product_detail'));
app.use('/show_specification', require('./routes/show_specification'));
app.use('/show_editing_product', require('./routes/show_editing_product'));
app.use('/edit_product', require('./routes/edit_product'));

app.use('/list_carts', require('./routes/list_carts'));
app.use('/create_cart', require('./routes/create_cart'));
app.use('/edit_cart', require('./routes/edit_cart'));
app.use('/delete_cart', require('./routes/delete_cart'));
app.use('/add_cart_item', require('./routes/add_cart_item'));
app.use('/show_cart', require('./routes/show_cart'));

app.use('/show_customers_warehouses', require('./routes/show_customers_warehouses'));
app.use('/show_contacts', require('./routes/show_contacts'));
app.use('/create_order', require('./routes/create_order'));
app.use('/show_order', require('./routes/show_order'));
app.use('/edit_order', require('./routes/edit_order'));
app.use('/show_editing_order', require('./routes/show_editing_order'));
app.use('/list_orders', require('./routes/list_orders'));
app.use('/add_order_item', require('./routes/add_order_item'));

app.use('/list_notifications', require('./routes/list_notifications'));

app.use('/query', require('./routes/query'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(8181, function(){
	console.log('Server is running! (8181 port)');

});

module.exports = app;
