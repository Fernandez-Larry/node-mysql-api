const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const config = require('../config.json');

const db: any = {};

module.exports = db;

initialize();

async function initialize() {
    const { host, port, user, database } = config.database;
    console.log('DB Config:', { host, port, user, database });

    const connection = await mysql.createConnection({ host, port, user });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    
    const sequelize = new Sequelize(database, user, '', { dialect: 'mysql' });
    
    const accountModel = require('../accounts/account.model').default;
const refreshTokenModel = require('../accounts/refresh-token.model').default;
    
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);
    
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
    console.log('Database initialized!');
}