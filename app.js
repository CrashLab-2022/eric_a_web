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

function open_door() {
    //문 열어주세요. 성공적으로 열면 true 반환
    const client = nh.serviceClient('/opendoor', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log('Opendoor Service response ' + JSON.stringify(resp));
    });
}

function close_door() {
    //문 닫아주세요. 성공적으로 열면 true 반환
    const client = nh.serviceClient('/closedoor', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log('closedoor Service response ' + JSON.stringify(resp));
    });
}

function destination(goal) {
    //목적지 start 처음, middle 중간, final 끝
    const client = nh.serviceClient('/closedoor', 'std_srvs/Trigger');
    client.call({ dest: goal }, (resp) => {
        console.log('closedoor Service response ' + JSON.stringify(resp));
    });
}

function itempush(goal) {
    //open에서 finish 받으면 실행 끝나면 true 반환
    const client = nh.serviceClient('/exection', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log('closedoor Service response ' + JSON.stringify(resp));
    });
}

function test() {
    console.log('test');
}

var app = express();

app.get('/index.html', (req, res) => {
    res.send('hello');
    test();
});

app.get('/opendoor', (req, res) => {
    console.log('open door');
    try {
        open_door();
        res.send('open door');
    } catch (err) {
        console.log(err);
    }
});

app.get('/closedoor', (req, res) => {
    console.log('close door');
    try {
        close_door();
        res.send('close door');
    } catch (err) {
        console.log(err);
    }
});

module.exports = app;
