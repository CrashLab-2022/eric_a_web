var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
// var sequelize = require('sequelize');
let deliveryService = require('./services/deliveryService');
const { time } = require('console');

// const middle_arrive = nh.advertiseService(
//     '/middle_arrive',
//     'std_srvs/Trigger',
//     (req, res) => {
//         console.log('middle_arrive');
//         middleStart();
//         return true;
//     }
// );

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
    let id = await deliveryService.findDelivery('접수지로 출발');
    console.log('currentId', id);
    await deliveryService.changeStatus(id, '접수지 도착');
}

let timeOut = true;
// 도착 신호 받으면 실행되는 함수

async function finalArrive() {
    let id = await deliveryService.findDelivery('배송지로 출발');
    await deliveryService.changeStatus(id, '배송지 도착');
    if (true) {
        timeOut = true;
        console.log('직접 수령 시도');
        console.log(currentId);
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
                    await deliveryService.finish(id);
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
            await deliveryService.finish(id);
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
let currentStatus = 0; // 0이면 대기 중, 1이면 사용 중

app.get('/arrive', async function (req, res) {
    console.log('arrive start');
    finalArrive();
});

app.get('/index.html', (req, res) => {
    test();
    res.send('hello');
});

app.get('/start/:id', async function (req, res) {
    try {
        let id = req.params.id;
        timeOut = true;
        // currentDelivery = await deliveryService.findDelivery();
        // console.log(currentDelivery);
        // currentId = currentDelivery[0].id;
        await deliveryService.changeStatus(id, '접수지로 출발');
        console.log('start');
        destination_middle();
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

app.get('/middlestart', async function (req, res) {
    console.log('middlestart');
    middleStart();
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

app.get('/adminopen', async function (req, res) {
    human_door_open();
    res.send(true);
});

app.get('/adminclose', async function (req, res) {
    human_door_close();
    res.send(true);
});

app.get('/adminstart/:id', async function (req, res) {
    currentId = req.params.id;
    await deliveryService.changeStatus(id, '배송지로 출발');
    destination_final();
    res.send(true);
});

// setInterval(async function () {
//     // currentDelivery = await deliveryService.findDelivery();
//     // currentId = currentDelivery[0].id;
// }, 1000);

module.exports = app;
