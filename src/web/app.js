// init - express app

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongodb-session')(session);

var config = require('config');
var model = require('lib/model');

// init - express app
var app = express();

// init - mongodb data connection
model.connect(config.db.data);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(Object.assign({
  store: new MongoStore({ uri: config.db.session })
}, config.cookie)));

// web routes
app.use('/', require('web/routes/index'));
app.use('/auth/facebook', require('web/routes/auth/facebook'));
app.use('/auth/instagram', require('web/routes/auth/instagram'));

// api routes
app.use('/api/instagram', require('web/routes/api/instagram'));
app.use('/api/photos', require('web/routes/api/photos'));

// slug routes
app.use('/', require('web/routes/slug'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
