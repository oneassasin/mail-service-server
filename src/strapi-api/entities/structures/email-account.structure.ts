import { EmailProviderStructure } from './email-provider.structure';

export class EmailAccountStructure {
  address: string;

  password: string;

  date_birth: string;

  email_provider?: EmailProviderStructure;

  name?: string;

  last_name?: string;

  geo?: number;
}
