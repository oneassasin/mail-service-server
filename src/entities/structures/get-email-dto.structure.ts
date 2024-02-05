import { IsIn, IsNumber, IsNumberString, IsOptional, IsString, IsUrl } from 'class-validator';
import { EMailType } from '../enums/mail-type.enum';
import { Transform } from 'class-transformer';

export class GetEmailDtoStructure {
  @IsString()
  @IsUrl(undefined, { message: 'BAD_SITE' })
  $SITE: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(EMailType), { message: 'BAD_DOMAIN' })
  $MAIL_TYPE: EMailType;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1], { message: 'SYSTEM_ERROR' })
  $PASSWORD?: number;

  // TODO: Add support
  @IsOptional()
  @IsString()
  $SUBJECT?: string;

  // TODO: Add support
  @IsOptional()
  @IsString()
  $REG_EXP?: string;

  @IsOptional()
  @IsString()
  @IsIn(['json', 'text'], { message: 'SYSTEM_ERROR' })
  $TYPE?: string;

  @IsOptional()
  @IsNumber()
  @IsIn(['2.0'], { message: 'SYSTEM_ERROR' })
  api: number;
}
