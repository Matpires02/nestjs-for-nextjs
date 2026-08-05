import 'dotenv/config';

import { DataSource } from 'typeorm';

const isSqlite = process.env.DB_TYPE === 'better-sqlite3';

const dataSource = new DataSource(
  isSqlite
    ? {
        type: 'better-sqlite3',
        database: process.env.DB_DATABASE || './db.sqlite',

        synchronize: false,

        entities: ['src/**/*.entity.ts'],

        migrations: ['src/migrations/*.ts'],
      }
    : {
        type: 'postgres',

        url: process.env.DB_DATABASE || '',

        ssl: {
          rejectUnauthorized: false,
        },

        synchronize: false,

        entities: ['src/**/*.entity.ts'],

        migrations: ['src/migrations/*.ts'],
      },
);

export default dataSource;
