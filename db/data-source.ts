/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions:DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities:["dist/**/*.entity.js"],
    migrations:["dist/db/migrations/*.js"],
    synchronize:true
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;