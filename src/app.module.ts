import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { DBLogger } from './utils/db-logger';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@songkeys/nestjs-redis';
import { ScheduleTasksModule } from './schedule-tasks/schedule-tasks.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailOperationsModule } from './mail-operations/mail-operations.module';
import { ApiModule } from './api/api.module';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './app-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: config.DB_URI,

      logger: config.ENV !== 'PRODUCTION' ? new DBLogger() : null,
      logging: config.ENV !== 'PRODUCTION' ? 'all' : false,

      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
      dropSchema: false,
    }),

    BullModule.forRoot({
      redis: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
        db: config.REDIS_DB,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 1000,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
        timeout: 30 * 60 * 1000,
        stackTraceLimit: 10,
      },
    }),

    RedisModule.forRoot({
      config: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
        password: config.REDIS_PASSWORD,
        db: config.REDIS_DB,
      },
    }),

    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ]
})
export class AppModule {
  static forRoot(): DynamicModule {
    const imports = [];

    if (['all', 'mail-worker'].includes(config.INSTANCE_TYPE)) {
      imports.push(...[
        MailOperationsModule.forRoot()
      ]);
    }

    if (['all', 'schedule'].includes(config.INSTANCE_TYPE)) {
      imports.push(...[
        ScheduleTasksModule,
      ]);
    }

    if (['all', 'api'].includes(config.INSTANCE_TYPE)) {
      imports.push(...[
        ApiModule,
      ]);
    }

    return {
      module: AppModule,
      imports,
    };
  }
}
