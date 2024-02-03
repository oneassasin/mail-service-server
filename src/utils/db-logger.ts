import { Logger as TypeOrmLogger } from 'typeorm/logger/Logger';
import { Logger } from '@nestjs/common';

export class DBLogger implements TypeOrmLogger {
  private logger = new Logger('DB');

  logQuery(query: string, parameters: any[]) {
    if (Array.isArray(parameters) && parameters.length !== 0) {
      this.logger.debug(`SQL: ${query}; Params: ${parameters}`);
      return;
    }

    this.logger.debug(`SQL: ${query}`);
  }

  logQueryError(error: string, query: string, parameters: any[]) {
    if (Array.isArray(parameters) && parameters.length !== 0) {
      this.logger.debug(`Error: ${error}; SQL: ${query}; Params: ${parameters}`);
      return;
    }

    this.logger.debug(`Error: ${error}; SQL: ${query}`);
  }

  logQuerySlow(time: number, query: string, parameters: any[]) {
    if (Array.isArray(parameters) && parameters.length !== 0) {
      this.logger.debug(`Slow SQL: ${query}; Params: ${parameters}; Time: ${time}`);
      return;
    }

    this.logger.debug(`Slow SQL: ${query}; Time: ${time}`);
  }

  logSchemaBuild(message: string) {
    this.logger.debug(`Build: ${message}`);
  }

  logMigration(message: string) {
    this.logger.debug(`Migration: ${message}`);
  }

  log(level: string, message: any) {
    if (level === 'log') {
      this.logger.debug(`TypeORM: ${message}`);
    } else if (level === 'info') {
      this.logger.log(`TypeORM: ${message}`);
    } else {
      this.logger.warn(`TypeORM: ${message}`);
    }
  }
}
