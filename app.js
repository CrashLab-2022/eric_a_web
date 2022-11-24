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

app.get('/index.html', (req, res) => {
    res.send('hello');
    opencv_capture();
});

module.exports = app;
