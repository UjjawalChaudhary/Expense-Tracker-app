

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

const DownloadData = sequelize.define('downloaddata', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    fileurl:Sequelize.STRING,

})

//module.exports = Expense;
module.exports=DownloadData;

