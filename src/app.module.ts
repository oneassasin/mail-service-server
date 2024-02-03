import { Module } from "@nestjs/common";
import { StrapiApiModule } from "./strapi-api/strapi-api.module";

@Module({
  imports: [
    StrapiApiModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
