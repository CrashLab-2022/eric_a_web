module.exports = function (sequelize, DataTypes) {
    let user = sequelize.define(
        'user',
        {
            phoneNumber: {
                type: DataTypes.STRING(100),
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER(1),
                allowNull: false,
            },
        },
        {}
    );
    user.associate = function (models) {
        user.hasMany(models.delivery);
    };
    return user;
};
