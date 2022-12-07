var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var dotenv = require('dotenv');
// var sequelize = require('sequelize');

// const rosnodejs = require('rosnodejs');

// rosnodejs.initNode('/hongdo_ros_web_node');
// const nh = rosnodejs.nh;

// function opnecv_capture() {
//     const client = nh.serviceClient('/capture', 'std_srvs/Trigger');
//     client.call();
// }

// function self_door_open() {
//     //문 열어주세요. 성공적으로 열면 true 반환, 3초뒤에 item push해주세요
//     const client = nh.serviceClient('/opendoor2', 'std_srvs/Trigger');
//     client.call((resp) => {
//         console.log('Self door open Service response ' + JSON.stringify(resp));
//     });
// }
// function itempush(goal) {
//     //open에서 finish 받으면 실행 끝나면 true 반환, 5초 뒤에 self_door_close해주세요
//     const client = nh.serviceClient('/exection', 'std_srvs/Trigger');
//     client.call((resp) => {
//         console.log('itempush Service response ' + JSON.stringify(resp));
//     });
// }
// function self_door_close() {
//     //문 닫아주세요. 성공적으로 열면 true 반환
//     const client = nh.serviceClient('/closedoor2', 'std_srvs/Trigger');
//     client.call((resp) => {
//         console.log('self door close Service response ' + JSON.stringify(resp));
//     });
// }
// function human_door_open() {
//     //문 열어주세요. 성공적으로 열면 true 반환,
//     const client = nh.serviceClient('/opendoor1', 'std_srvs/Trigger');
//     client.call((resp) => {
//         console.log('Human door open Service response ' + JSON.stringify(resp));
//     });
// }

// function human_door_close() {
//     //문 닫아주세요. 성공적으로 열면 true 반환,
//     const client = nh.serviceClient('/closedoor1', 'std_srvs/Trigger');
//     client.call((resp) => {
//         console.log(
//             'human door close Service response ' + JSON.stringify(resp)
//         );
//     });
// }

// function destination(goal) {
//     //목적지 start 처음, middle 중간, final 끝
//     const client = nh.serviceClient('/closedoor', 'std_srvs/Trigger');
//     client.call({ dest: goal }, (resp) => {
//         console.log('Destination Service response ' + JSON.stringify(resp));
//     });
// }

// let middleArrive = rosNode.advertiseService(
//     '/middle_arrive',
//     SetBool,
//     (req, resp) => {
//         rosnodejs.log.info('Handling request! ' + JSON.stringify(req));
//         resp.success = !req.data;
//         resp.message = 'Inverted!';
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

app.get('/index.html', (req, res) => {
    test();
    res.send('hello');
});

module.exports = app;
