import { Module } from "@nestjs/common";
import { StrapiApiModule } from "./strapi-api/strapi-api.module";
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { DBLogger } from './utils/db-logger';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@songkeys/nestjs-redis';

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
      },
    }),

    StrapiApiModule,
  ],
})
export class AppModule {
}
