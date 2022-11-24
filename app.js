var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var dotenv = require('dotenv');
var sequelize = require('sequelize');

const rosnodejs = require('rosnodejs');

rosnodejs.initNode('/hongdo_ros_web_node');
const nh = rosnodejs.nh;

function opnecv_capture() {
    const client = nh.serviceClient('/capture', 'std_srvs/Trigger');
    client.call();
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/index.html', (req, res) => {
    res.send('hello');
    opencv_capture();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
