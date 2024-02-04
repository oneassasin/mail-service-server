import { EmailProviderStructure } from './email-provider.structure';
import { GeoStructure } from './geo.structure';
import { StrapiDataResponseStructure } from './strapi-data-response.structure';

export class EmailAccountStructure {
  address: string;

  password: string;

  date_birth: string;

  email_provider?: StrapiDataResponseStructure<EmailProviderStructure>;

  name?: string;

  last_name?: string;

  geo?: StrapiDataResponseStructure<GeoStructure>;
}
