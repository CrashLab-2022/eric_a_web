var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
// var sequelize = require('sequelize');
let deliveryService = require('./services/deliveryService');

const rosnodejs = require('rosnodejs');

rosnodejs.initNode('/hongdo_ros_web_node');
const nh = rosnodejs.nh;

function opnecv_capture() {
    const client = nh.serviceClient('/capture', 'std_srvs/Trigger');
    client.call();
}

function self_door_open() {
    //문 열어주세요. 성공적으로 열면 true 반환, 3초뒤에 item push해주세요
    const client = nh.serviceClient('/opendoor2', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log('Self door open Service response ' + JSON.stringify(resp));
    });
}
function itempush() {
    //open에서 finish 받으면 실행 끝나면 true 반환, 5초 뒤에 self_door_close해주세요
    const client = nh.serviceClient('/exection', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log('itempush Service response ' + JSON.stringify(resp));
    });
}
function self_door_close() {
    //문 닫아주세요. 성공적으로 열면 true 반환
    const client = nh.serviceClient('/closedoor2', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log('self door close Service response ' + JSON.stringify(resp));
    });
}
function human_door_open() {
    //문 열어주세요. 성공적으로 열면 true 반환,
    const client = nh.serviceClient('/opendoor1', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log('Human door open Service response ' + JSON.stringify(resp));
    });
}

function human_door_close() {
    //문 닫아주세요. 성공적으로 열면 true 반환,
    const client = nh.serviceClient('/closedoor1', 'std_srvs/Trigger');
    client.call((resp) => {
        console.log(
            'human door close Service response ' + JSON.stringify(resp)
        );
    });
}

function destination(goal) {
    //목적지 start 처음, middle 중간, final 끝
    const client = nh.serviceClient('/closedoor', 'std_srvs/Trigger');
    client.call({ dest: goal }, (resp) => {
        console.log('Destination Service response ' + JSON.stringify(resp));
    });
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
                destination(final);
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
        await deliveryService.finish(currentId);
        destination(final);
    }
}

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
        currentDelivery = deliveryService.findDelivery();
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
    console.log('try open');
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

app.get('/push', async function (req, res) {
    itempush();
});

// setInterval(async function () {
//     // currentDelivery = await deliveryService.findDelivery();
//     // currentId = currentDelivery[0].id;
// }, 1000);

module.exports = app;
