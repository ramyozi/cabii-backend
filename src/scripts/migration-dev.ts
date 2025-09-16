import 'dotenv/config';

import prompts from 'prompts';
import { MigrationGenerateCommand } from 'typeorm/commands/MigrationGenerateCommand';

import { appDataSource } from '../infrastructure/app-data-source';

(async () => {
  // Ask for migration name
  const response = await prompts({
    type: 'text',
    name: 'migrationName',
    message: 'Enter migration name in kebab-case:',
    initial: 'my-migration',
  });

  const migrationName = response.migrationName
    .replaceAll(' ', '-')
    .toLowerCase()
    .trim();

  try {
    if (process.env.NODE_ENV !== 'dev') {
      console.warn(
        'Warning !!! You are not in test or dev environment. The database will be cleared. in 5 seconds.',
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    await appDataSource.initialize();
    await appDataSource.dropDatabase();
    await appDataSource.query('DROP SCHEMA IF EXISTS audit CASCADE;');
    await appDataSource.runMigrations();

    await appDataSource.destroy(); // = close

    const path = `src/infrastructure/migration/${migrationName}`;

    const migrationGenerateCommand = new MigrationGenerateCommand();

    await migrationGenerateCommand.handler({
      path,
      dataSource: 'src/infrastructure/app-data-source.ts',
    });

    console.log('\x1b[32m%s\x1b[0m', 'Migration successfully generated.');
    console.log('\x1b[33m%s\x1b[0m', 'Please run the migration now.');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', error.message);
    process.exit(1);
  }
})();
