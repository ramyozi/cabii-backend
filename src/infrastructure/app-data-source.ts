import 'dotenv/config';

import { join } from 'path';

import { DataSource } from 'typeorm';

const entitiesPath = join(__dirname, '../domain/entity/**/*.{ts,js}');

export const appDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT!, 10),
  ssl: { rejectUnauthorized: false },
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: [entitiesPath],
  synchronize: true,
});
