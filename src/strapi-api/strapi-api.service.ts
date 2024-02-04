import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EmailAccountStructure } from './entities/structures/email-account.structure';
import { GeoStructure } from './entities/structures/geo.structure';
import config from '../config';
import { firstValueFrom } from 'rxjs';
import { StrapiResponseStructure } from './entities/structures/strapi-response.structure';
import { EmailProviderStructure } from './entities/structures/email-provider.structure';

@Injectable()
export class StrapiApiService {
  constructor(private httpService: HttpService) {
    this.httpService.axiosRef.defaults.baseURL = config.STRAPI_URL;
    this.httpService.axiosRef.defaults.headers['Authorization'] = `Bearer ${config.STRAPI_API_TOKEN}`;
  }

  async getEmailAccounts(): Promise<StrapiResponseStructure<EmailAccountStructure>[]> {
    const response$ = this.httpService.get(
      `email-accounts`,
      {
        params: {
          populate: '*'
        }
      }
    );
    const response = await firstValueFrom(response$);

    return response.data.data;
  }

  async getGeoList(): Promise<StrapiResponseStructure<GeoStructure>[]> {
    const response$ = this.httpService.get(`geos`);
    const response = await firstValueFrom(response$);

    return response.data.data;
  }

  async getEmailProviders(): Promise<StrapiResponseStructure<EmailProviderStructure>[]> {
    const response$ = this.httpService.get(`email-providers`);
    const response = await firstValueFrom(response$);

    return response.data.data;
  }

  async getEmailAccount(accountId: number): Promise<StrapiResponseStructure<EmailAccountStructure>> {
    const response$ = this.httpService.get(
      `${config.STRAPI_URL}/email-accounts/${accountId}`,
      {
        params: {
          populate: '*'
        }
      }
    );
    const response = await firstValueFrom(response$);

    return response.data.data;
  }
}
