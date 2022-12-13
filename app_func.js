var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
// var sequelize = require('sequelize');
let deliveryService = require('./services/deliveryService');
const { time } = require('console');

function self_door_open() {
    console.log('func: self_door_open');
}
function itempush(goal) {
    console.log('func: itempush');
}
function self_door_close() {
    console.log('func: self_door_close');
}
function human_door_open() {
    console.log('func: human_door_open');
}

function human_door_close() {
    console.log('func: human_door_close');
}

function destination_middle() {
    console.log('destination_middle');
}

function destination_final() {
    console.log('destination_final');
}

function destination_start() {
    console.log('destination_start');
}

async function middleStart() {
    human_door_open();
    setTimeout(function () {
        human_door_close();
    }, 1000 * 20); // 20초 후 닫힘
    await deliveryService.startCustomer(currentId);
    setTimeout(function () {
        destination_final();
    }, 1000 * 40);
}

let timeOut = true;
// 도착 신호 받으면 실행되는 함수

async function customerStart() {
    // await deliveryService.arrive(currentId);
    if (true) {
        timeOut = true;
        console.log('직접 수령 시도');
        setTimeout(function () {
            if (timeOut) {
                console.log('timeout, 직접 수령 불가');
                self_door_open();
                setTimeout(function () {
                    itempush();
                }, 1000 * 3);

                setTimeout(function () {
                    self_door_close();
                }, 1000 * 4);

                setTimeout(async function () {
                    // await deliveryService.finish(currentId);
                    destination_start();
                }, 1000 * 6);
            }
        }, 1000 * 10);
    } else {
        console.log('직접 수령 아님');
        self_door_open();
        setTimeout(function () {
            itempush();
        }, 1000 * 2);
        setTimeout(function () {
            self_door_close();
        }, 1000 * 4);
        setTimeout(async function () {
            // await deliveryService.finish(currentId);
            destination_start();
        }, 1000 * 6);
    }
}

function test() {
    console.log('This is test!');
}

var app = express();
let currentId = 0;
let currentDelivery = null;

app.get('/arrive', async function (req, res) {
    console.log('arrive start');
    customerStart();
});

app.get('/index.html', (req, res) => {
    test();
    res.send('hello');
});

app.get('/start', async function (req, res) {
    try {
        timeOut = true;
        currentDelivery = await deliveryService.findDelivery();
        console.log(currentDelivery);
        currentId = currentDelivery[0].id;
        console.log('start');
        destination_middle();
        await deliveryService.startDelivery(currentId);
        console.log(currentDelivery);
        res.send('start success');
    } catch (err) {
        console.log(err);
        res.send('start error');
    }
});

let open = false;
app.get('/open', async function (req, res) {
    console.log('try open');
    try {
        console.log('open', open);
        console.log(currentDelivery);
        if (!open) {
            open = true;
            res.send('open start');
            timeOut = false;
            human_door_open();
            setTimeout(function () {
                human_door_close();
            }, 1000 * 2);
            setTimeout(async function () {
                // await deliveryService.finish(currentId);
                destination_start();
                open = false;
            }, 1000 * 4);
        } else {
            res.send('already open');
        }
    } catch (err) {
        console.log(err);
    }
});

app.get('/itempush', async function (req, res) {
    let result = itempush();
    console.log(req);
    console.log(res);
    res.sendStatus(200);
});

app.get('/humandoorclose', async function (req, res) {
    human_door_close();
});

app.get('/selfdooropen', async function (req, res) {
    self_door_open();
});

app.get('/humandooropen', async function (req, res) {
    human_door_open();
});

app.get('/selfdoorclose', async function (req, res) {
    self_door_close();
});

app.get('/selftest', async function (req, res) {
    self_door_open();
    setTimeout(function () {
        itempush();
    }, 1000 * 20);
    setTimeout(function () {
        self_door_close();
    }, 1000 * 25);
});

app.get('/test', async function (req, res) {
    console.log('test');
    res.send('test');
});

// setInterval(async function () {
//     // currentDelivery = await deliveryService.findDelivery();
//     // currentId = currentDelivery[0].id;
// }, 1000);

module.exports = app;
