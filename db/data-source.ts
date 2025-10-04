/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

const isProd=process.env.NODE_ENV==='production';
const caCertPath = path.resolve(process.cwd(), 'certs', 'prod-ca-2021.crt');
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: true,
  ssl: isProd
    ? {
        ca: fs.readFileSync(caCertPath).toString(),
      }
    : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
