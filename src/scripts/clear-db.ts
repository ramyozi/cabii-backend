import 'dotenv/config';

import { appDataSource } from '../infrastructure/app-data-source';

(async () => {
  try {
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'dev') {
      console.warn(
        'Warning !!! You are not in test or dev environment. The database will be cleared. in 5 seconds.',
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (
      process.env.NODE_ENV === 'prod' ||
      process.env.NODE_ENV === 'production'
    ) {
      throw new Error(
        'WARNING !!! You are trying to clear the PRODUCTION DATABASE.',
      );
    }

    await appDataSource.initialize();
    console.log('\x1b[33m%s\x1b[0m', 'Clearing database...');
    await appDataSource.dropDatabase();
    await appDataSource.query(`DROP SCHEMA IF EXISTS audit CASCADE`);
    console.log('\x1b[33m%s\x1b[0m', 'Running migrations...');
    await appDataSource.runMigrations();
    await appDataSource.destroy(); // = close

    console.log('\x1b[32m%s\x1b[0m', 'Database successfully cleared.');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error.message);
    process.exit(1);
  }
})();
