var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
// var sequelize = require('sequelize');
let deliveryService = require('./services/deliveryService');

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

function destination(goal) {
    console.log('func: destination', goal);
}

async function middleStart() {
    human_door_open();
    setTimeout(function () {
        human_door_close();
    }, 5000); // 5초 후 닫힘
    await deliveryService.startCustomer(currentId);
    destination(currentDelivery[0].destination);
}

let timeOut = true;
// 도착 신호 받으면 실행되는 함수

async function customerStart() {
    await deliveryService.arrive(currentId);
    if (currentDelivery[0].isInPerson == '직접 수령하기') {
        setTimeout(function () {
            if (timeout) {
                if (self_door_open()) {
                    console.log('self door open');
                    setTimeout(function () {
                        if (itempush()) {
                            console.log('item push');
                        }
                    }, 1000 * 20);
                    setTimeout(function () {
                        if (self_door_close()) {
                            console.log('self door close');
                        }
                    }, 1000 * 20);
                }
                deliveryService.finish(currentId);
                destination('final');
            }
        });
    } else {
        if (self_door_open()) {
            console.log('self door open');
            setTimeout(function () {
                if (itempush()) {
                    console.log('item push');
                }
            }, 1000 * 20);
            setTimeout(function () {
                if (self_door_close()) {
                    console.log('self door close');
                }
            }, 1000 * 20);
        }
        deliveryService.finish(currentId);
        destination('final');
    }
}

// let middleArrive = rosNode.advertiseService(
//     '/middle_arrive',
//     SetBool,
//     (req, resp) => {
//         rosnodejs.log.info('Handling request! ' + JSON.stringify(req));
//         resp.success = !req.data;
//         resp.message = 'Inverted!';
//         middleStart();
//         return true;
//     }
// );

// const whitelist = [
//     'http://localhost:3000',
//     'https://eric-a.netlify.app',
//     'http://dev.bbbae.shop',
// ];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         }
//     },
//     credentials: true,
// };

function test() {
    console.log('This is test!');
}

var app = express();
let currentId = 0;
let currentDelivery = null;

app.get('/index.html', (req, res) => {
    test();
    res.send('hello');
});

app.get('/start', async function (req, res) {
    try {
        currentDelivery = await deliveryService.findDelivery();
        currentId = currentDelivery[0].id;
        console.log('start');
        destination('start');
        deliveryService.startDelivery(currentId);
        console.log(currentDelivery);
        console.log('김채원바보');
        res.send('start success');
    } catch (err) {
        console.log(err);
        res.send('start error');
    }
});

let open = false;
app.get('/open', async function (req, res) {
    console.log('뭔소리고');
    try {
        console.log('open', open);
        console.log(currentDelivery);
        if (!open) {
            open = true;
            res.send('open start');
            timeOut = false;
            human_door_open();
            console.log('human_door_open');
            setTimeout(function () {
                if (human_door_close()) {
                    console.log('human_door_close');
                }
            }, 1000 * 20);
            setTimeout(async function () {
                await deliveryService.finish(currentId);
                destination('final');
                open = false;
            }, 1000 * 40);
        } else {
            res.send('already open');
        }
    } catch (err) {
        console.log(err);
    }
});

setInterval(async function () {
    // currentDelivery = await deliveryService.findDelivery();
    // currentId = currentDelivery[0].id;
}, 1000);

module.exports = app;
