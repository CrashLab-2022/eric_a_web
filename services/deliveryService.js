const { delivery, user } = require('../models');

module.exports = {
    findDelivery: async function (status) {
        const deliveryResult = await delivery.findOne({
            where: { status: status },
        });
        return deliveryResult.dataValues.id;
    },
    findDeliveryPerson: async function (id) {
        const deliveryResult = await delivery.findOne({
            where: { id: id },
        });
        return deliveryResult.dataValues.inPerson;
    },
    changeStatus: async function (id, status) {
        delivery
            .update(
                {
                    status: status,
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
