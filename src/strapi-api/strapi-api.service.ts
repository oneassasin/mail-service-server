import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EmailAccountStructure } from './entities/structures/email-account.structure';
import { GeoStructure } from './entities/structures/geo.structure';
import config from '../config';
import { firstValueFrom } from 'rxjs';
import { StrapiResponseStructure } from './entities/structures/strapi-response.structure';
import { EmailProviderStructure } from './entities/structures/email-provider.structure';
import { GetEmailAccountsParamsStructure } from './entities/structures/get-email-accounts-params.structure';

@Injectable()
export class StrapiApiService {
  constructor(private httpService: HttpService) {
    this.httpService.axiosRef.defaults.baseURL = config.STRAPI_URL;
    this.httpService.axiosRef.defaults.headers['Authorization'] = `Bearer ${config.STRAPI_API_TOKEN}`;
  }

  async getEmailAccounts(
    { page = 1, pageSize = 25, mailProviderId, notIn, address }: GetEmailAccountsParamsStructure
  ): Promise<StrapiResponseStructure<EmailAccountStructure>[]> {
    const params = {
      'pagination[pageSize]': pageSize,
      'pagination[page]': page,
      'filters[is_confirmed]': true,
      'filters[is_banned]': false,
    };

    if (mailProviderId) {
      params['filters[email_provider]'] = mailProviderId;
    }

    if (notIn) {
      notIn.forEach((id, index) => params[`filters[id][$notIn][${index}]`] = id);
    }

    if (address) {
      params['filters[address]'] = address;
    }

    const response$ = this.httpService.get(
      `email-accounts`,
      {
        params: {
          populate: '*',
          ...params,
        },
      }
    );
    const response = await firstValueFrom(response$);

    return response.data.data;
  }

  async getGeoList(pageSize = 25, page = 1): Promise<StrapiResponseStructure<GeoStructure>[]> {
    const response$ = this.httpService.get(
      `geos`,
      {
        params: {
          'pagination[pageSize]': pageSize,
          'pagination[page]': page,
        },
      }
    );
    const response = await firstValueFrom(response$);

    return response.data.data;
  }

  async getEmailProviders(
    pageSize = 25,
    page = 1,
  ): Promise<StrapiResponseStructure<EmailProviderStructure>[]> {
    const response$ = this.httpService.get(
      `email-providers`,
      {
        params: {
          'pagination[pageSize]': pageSize,
          'pagination[page]': page,
        },
      }
    );
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

  async getEmailAccountsCount(mailProviderId?: number) {
    const response$ = this.httpService.get(
      `email-accounts`,
      {
        params: {
          populate: '*',
          ...(mailProviderId ? { mailProviderId } : {})
        },
      }
    );
    const response = await firstValueFrom(response$);

    return response.data.meta.pagination.total;
  }
}
