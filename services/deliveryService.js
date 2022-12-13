const { delivery, user } = require('../models');

module.exports = {
    findDelivery: async function () {
        const deliveryResult = await delivery.findOne({
            where: { isAccepted: '접수 완료' },
        });
        const result = [];
        result.push({
            id: deliveryResult.dataValues.id,
            name: deliveryResult.dataValues.name,
            phoneNumber: deliveryResult.dataValues.phoneNumber,
            destination: deliveryResult.dataValues.destination,
            isInPerson: deliveryResult.dataValues.inPerson
                ? '직접 수령하기'
                : '두고 가기',
            item: deliveryResult.dataValues.item,
            status: deliveryResult.dataValues.status,
            date: deliveryResult.dataValues.date,
            time: deliveryResult.dataValues.time,
            isAccepted: deliveryResult.dataValues.isAccepted,
        });
        return result;
    },
    startDelivery: async function (id) {
        delivery
            .update(
                {
                    status: '이동 중',
                },
                { where: { id: id } }
            )
            .then(() => {
                return true;
            })
            .catch((err) => {
                return false;
            });
    },
    arriveAdmin: async function (id) {
        delivery
            .update(
                {
                    status: '접수지 도착',
                },
                { where: { id: id } }
            )
            .then(() => {
                return true;
            })
            .catch((err) => {
                return false;
            });
    },
    startCustomer: async function (id) {
        delivery
            .update(
                {
                    status: '배송 출발',
                },
                { where: { id: id } }
            )
            .then(() => {
                return true;
            })
            .catch((err) => {
                return false;
            });
    },
    arrive: async function (id) {
        delivery
            .update(
                {
                    status: '배송지 도착',
                },
                { where: { id: id } }
            )
            .then(() => {
                return true;
            })
            .catch((err) => {
                return false;
            });
    },
    finish: async function (id) {
        delivery
            .update(
                {
                    status: '배송 완료',
                },
                { where: { id: id } }
            )
            .then(() => {
                return true;
            })
            .catch((err) => {
                return false;
            });
    },
};
