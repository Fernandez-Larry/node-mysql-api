export {};
// Railway deploy fix
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const db: any = {};

module.exports = db;

initialize();

async function initialize() {
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT) || 3306;
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'node_mysql_api';

    console.log('DB Config:', { host, port, user, database });

    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql'
    });

    const accountModel = require('../accounts/account.model').default;
    const refreshTokenModel = require('../accounts/refresh-token.model').default;

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    await sequelize.sync();
    console.log('Database initialized!');
}
