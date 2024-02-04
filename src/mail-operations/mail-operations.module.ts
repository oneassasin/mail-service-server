import { DynamicModule, Module } from '@nestjs/common';
import { MailOperationsProcessor } from './mail-operations.processor';
import { LockerService } from './locker.service';
import { MailOperationsService } from './mail-operations.service';
import { StrapiApiModule } from '../strapi-api/strapi-api.module';
import config from '../config';

@Module({
  imports: [
    StrapiApiModule,
  ],
  providers: [
    LockerService,
  ],
  exports: [
    LockerService,
  ]
})
export class MailOperationsModule {
  static forRoot(): DynamicModule {
    const providers = [];

    if (['all', 'mail-worker'].includes(config.INSTANCE_TYPE)) {
      providers.push(...[
        MailOperationsProcessor,
        MailOperationsService,
      ]);
    }

    return {
      module: MailOperationsModule,
      providers,
    };
  }
}
