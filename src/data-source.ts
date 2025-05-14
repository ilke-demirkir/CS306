import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
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
