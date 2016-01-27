import config    from '../utils/config';
import path      from 'path';
import fs        from 'fs';
import Sequelize from 'sequelize';

let db = {};
let sequelize = new Sequelize(
    config.db.database,
    config.db.user,
    config.db.password,
    {
        dialect: config.db.dialect,
        host: config.db.host,
    }
);

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db

