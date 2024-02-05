import { GetPaginatesParamsStructure } from './get-paginates-params.structure';

export class GetEmailAccountsParamsStructure extends GetPaginatesParamsStructure {
  mailProviderId?: number;

  notIn?: number[];

  address?: string;
}
