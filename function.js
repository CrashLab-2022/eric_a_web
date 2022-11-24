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
    const client = nh.serviceClient('/set_odom', 'eric_a_bringup/ResetOdom');
    client.call({x:1,y:1,z:1});
}



var app = express();

app.get('/index.html', (req, res) => {
    res.send('hello');
    opnecv_capture();
});

module.exports = app;
