/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions:DataSourceOptions = {
    type: 'postgres',
    host: "localhost",
    port:  5432,
    username: "postgres",
    password: "postgrepassword123#",
    database: "pharmacy",
    schema:"pharmacy",
    entities:["dist/**/*.entity.js"],
    migrations:["dist/db/migrations/*.js"],
    synchronize:true
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;