import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { StrapiApiModule } from '../strapi-api/strapi-api.module';
import { ApiMailController } from './api-mail.controller';

@Module({
  imports: [
    StrapiApiModule,
  ],
  providers: [
    ApiService,
  ],
  controllers: [
    ApiController,
    ApiMailController,
  ],
})
export class ApiModule {
}
