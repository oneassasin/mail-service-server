import { IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { EMailType } from '../enums/mail-type.enum';

export class GetBalanceDtoStructure {
  @IsOptional()
  @IsString()
  @IsIn(['json', 'text'])
  $TYPE?: string;
}
