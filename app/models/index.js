const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshToken.model.js")(sequelize, Sequelize);


db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.tag = require("./tag.model.js")(sequelize, Sequelize);

//relacion uno a muchos one-to-many
db.comments = require("./comment.model.js")(sequelize, Sequelize);

db.tutorials.hasMany(db.comments, { as: "comments" });
db.comments.belongsTo(db.tutorials, {
    foreignKey: "tutorialId",
    as: "tutorial",
});
//relacion uno a muchos one-to-many
//relacion muchos a muchos many-to-many
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.refreshToken.belongsTo(db.user, {
    foreignKey: 'userId',
    targetKey: 'id'
});
db.user.hasOne(db.refreshToken, {
    foreignKey: 'userId',
    targetKey: 'id'
});

db.tag.belongsToMany(db.tutorials, {
    through: "tutorial_tag",
    as: "tutorials",
    foreignKey: "tag_id",
});
db.tutorials.belongsToMany(db.tag, {
    through: "tutorial_tag",
    as: "tags",
    foreignKey: "tutorial_id",
});
//relacion muchos a muchos many-to-many

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;