#!/usr/bin/env node

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
// var sequelize = require('sequelize');
let deliveryService = require('./services/deliveryService');

const rosnodejs = require('rosnodejs');
const { CommState } = require('rosnodejs/dist/actions/ClientStates');
rosnodejs.initNode('/eric_a_ros_web_node');
const nh = rosnodejs.nh;

function opnecv_capture() {
    const client = nh.serviceClient('/capture', 'std_srvs/Trigger');
    client.call();
}

// 경유지에 도착함
const middle_arrive = nh.advertiseService(
    '/middle_arrive',
    'std_srvs/Trigger',
    (req, res) => {
        console.log('middle_arrive');
        middleArrive();
        return true;
    }
);

// 배송지에 도착함
const final_arrive = nh.advertiseService(
    '/final_arrive',
    'std_srvs/Trigger',
    (req, res) => {
        console.log('final_arrive');
        customerArrive();
        return true;
    }
);

const start_arrive = nh.advertiseService(
    '/start_arrive',
    'std_srvs/Trigger',
    (req, res) => {
        console.log('start_arrive');
        return true;
    }
);

function self_door_open() {
    //문 열어주세요. 성공적으로 열면 true 반환, 3초뒤에 item push해주세요
    const client = nh.serviceClient('/opendoor_2', 'std_srvs/Trigger');
    console.log('func: self_door_close');
    client.call((resp) => {
        console.log('Self door open Service response ' + JSON.stringify(resp));
    });
}
function itempush() {
    //open에서 finish 받으면 실행 끝나면 true 반환, 5초 뒤에 self_door_close해주세요
    const client = nh.serviceClient('/exection', 'std_srvs/Trigger');
    console.log('func: itempush');
    client.call((resp) => {
        console.log('itempush Service response ' + JSON.stringify(resp));
    });
}
function self_door_close() {
    //문 닫아주세요. 성공적으로 열면 true 반환
    const client = nh.serviceClient('/closedoor_2', 'std_srvs/Trigger');
    console.log('func: self_door_open');
    client.call((resp) => {
        console.log('self door close Service response ' + JSON.stringify(resp));
    });
}
function human_door_open() {
    //문 열어주세요. 성공적으로 열면 true 반환,
    const client = nh.serviceClient('/opendoor_1', 'std_srvs/Trigger');
    console.log('func: human_door_open');
    client.call((resp) => {
        console.log('Human door open Service response ' + JSON.stringify(resp));
    });
}

function human_door_close() {
    //문 닫아주세요. 성공적으로 열면 true 반환,
    const client = nh.serviceClient('/closedoor_1', 'std_srvs/Trigger');
    console.log('func: human_door_close');
    client.call((resp) => {
        console.log(
            'human door close Service response ' + JSON.stringify(resp)
        );
    });
}

function destination_middle() {
    //목적지 start 처음, middle 경유지, final 끝
    // 경유지 출발
    const client = nh.serviceClient('/middle', 'std_srvs/Trigger');
    console.log('func: destination_middle');
    client.call((resp) => {
        console.log('Destination Service response ' + JSON.stringify(resp));
    });
}

function destination_final() {
    //목적지 start 처음, middle 경유지, final 끝
    // 도착지 출발
    const client = nh.serviceClient('/final', 'std_srvs/Trigger');
    console.log('func: destination_final');
    client.call((resp) => {
        console.log('Destination Service response ' + JSON.stringify(resp));
    });
}

function destination_start() {
    //목적지 start 처음, middle 경유지, final 끝
    // 출발지 출발
    const client = nh.serviceClient('/start', 'std_srvs/Trigger');
    console.log('func: destination_start');
    client.call((resp) => {
        console.log('Destination Service response ' + JSON.stringify(resp));
    });
}

async function middleArrive() {
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

async function customerArrive() {
    await deliveryService.arrive(currentId);
    if (currentDelivery[0].isInPerson == '직접 수령하기') {
        timeOut = true;
        console.log('직접 수령 시도');
        setTimeout(function () {
            if (timeOut) {
                console.log('시간 초과, 두고 가기로 변경');
                self_door_open();
                setTimeout(function () {
                    itempush();
                }, 1000 * 20);

                setTimeout(function () {
                    self_door_close();
                }, 1000 * 40);

                setTimeout(async function () {
                    await deliveryService.finish(currentId);
                    destination_start();
                }, 1000 * 60);
            }
        }, 1000 * 60 * 3);
    } else {
        console.log('두고 가기 시작');
        self_door_open();
        setTimeout(function () {
            itempush();
        }, 1000 * 20);
        setTimeout(function () {
            self_door_close();
        }, 1000 * 40);
        setTimeout(async function () {
            await deliveryService.finish(currentId);
            destination_start();
        }, 1000 * 60);
    }
}

var app = express();
let currentId = 0;
let currentDelivery = null;

app.get('/index.html', (req, res) => {
    test();
    res.send('hello');
});

app.get('/start/:id', async function (req, res) {
    try {
        currentId = req.params.id;
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
    console.log('직접 수령하기 시작');
    try {
        console.log('open', open);
        if (!open) {
            open = true;
            res.send('open start');
            timeOut = false;
            human_door_open();
            setTimeout(function () {
                human_door_close();
            }, 1000 * 20);
            setTimeout(async function () {
                await deliveryService.finish(currentId);
                destination_start();
                open = false;
            }, 1000 * 40);
        } else {
            res.send('already open');
        }
    } catch (err) {
        console.log(err);
    }
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
    await deliveryService.startCustomer(currentId);
    destination_final();
    res.send(true);
});

app.get('/test', async function (req, res) {
    console.log('test');
    res.send('test');
});

app.get('/itempush', async function (req, res) {
    itempush();
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

module.exports = app;
