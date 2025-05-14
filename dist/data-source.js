"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Antalya04",
    database: "project",
    extra: {
        multipleStatements: true,
    },
    // Turn off automatic schema sync if you're using raw SQL:
    synchronize: false,
    logging: false,
    entities: [], // not using entities in this case
});
