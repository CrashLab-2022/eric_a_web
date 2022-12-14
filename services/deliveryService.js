const { delivery, user } = require('../models');

module.exports = {
    findDelivery: async function (status) {
        console.log(status);
        const deliveryResult = await delivery.findOne({
            where: { status: status },
        });
        console.log();
        return deliveryResult.dataValues.id;
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
