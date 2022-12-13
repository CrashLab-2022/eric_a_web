const { delivery, user } = require('../models');

module.exports = {
    findDelivery: async function () {
        const deliveryResult = await delivery.findOne({
            where: { status: '출발 전' },
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
            open: deliveryResult.dataValues.openRequest,
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
    startCustomer: async function (id) {
        delivery
            .update(
                {
                    status: '배송 중',
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
