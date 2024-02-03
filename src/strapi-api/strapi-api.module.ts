import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { StrapiApiService } from './strapi-api.service';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    StrapiApiService,
  ],
})
export class StrapiApiModule {
}
