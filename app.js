var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var highScoresController = require('./server/controllers/highScoresController');
var legendController = require('./server/controllers/legendController');

var routes = require('./server/routes/index');

var app = express();


app.engine('html', require('ejs').renderFile);
// view engine setup
app.set('views', path.join(__dirname, '/client/views'));
app.set('view engine', 'html');

if (app.get('env') !== 'development') {
  app.set('port', (process.env.PORT || 3000));
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, '/client')));
app.use(express.static(path.join(__dirname, '/client')));

app.use('/', routes);

if (app.get('env') !== 'development') {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

  mongoose.connect('mongodb://heroku_5jdf795j:vuc3jhnp7fjs61n5jeiubl8hrt@ds055584.mongolab.com:55584/heroku_5jdf795j');
}

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
  mongoose.connect('mongodb://localhost:27017/escapeDarkness');

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
