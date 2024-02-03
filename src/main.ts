import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from 'helmet';
import * as csurf from 'csurf';
import config from './config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RateLimit = require('express-rate-limit');

async function bootstrap() {
  if (config.INSTANCE_TYPE === 'api') {
    await startApiInstance();
  } else {
    const app = await NestFactory.createApplicationContext(AppModule, {});

    app.useLogger(config.ENV === 'PRODUCTION' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug']);
  }
}

async function startApiInstance() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    {
      cors: {
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        preflightContinue: false,
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    RateLimit({
      windowMs: 60 * 1000,
      limit: 1000,
    }),
  );

  app.useLogger(config.ENV === 'PRODUCTION' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'debug']);

  await app.listen(3000);

  app.use(csurf());
}

bootstrap();
