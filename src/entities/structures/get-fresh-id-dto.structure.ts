import { IsEmail, IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { EMailType } from '../enums/mail-type.enum';

export class GetFreshIdDtoStructure {
  @IsString()
  @IsUrl(undefined, { message: 'BAD_SITE' })
  $SITE: string;

  @IsString()
  @IsEmail(undefined, { message: 'BAD_SITE' })
  $EMAIL: string;

  @IsOptional()
  @IsString()
  @IsIn(['json', 'text'])
  $TYPE?: string;

  @IsOptional()
  @IsNumber()
  @IsIn([2.0], { message: 'SYSTEM_ERROR' })
  api: number;
}
