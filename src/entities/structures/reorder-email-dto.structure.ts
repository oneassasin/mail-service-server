import { IsEmail, IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { EMailType } from '../enums/mail-type.enum';
import { Transform } from 'class-transformer';

export class ReorderEmailDtoStructure {
  @IsString()
  @IsUrl(undefined, { message: 'BAD_SITE' })
  $SITE: string;

  @IsString()
  @IsEmail(undefined, { message: 'BAD_SITE' })
  $EMAIL: string;

  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1], { message: 'SYSTEM_ERROR' })
  $PASSWORD?: number;

  @IsOptional()
  @IsString()
  @IsIn(['json', 'text'])
  $TYPE?: string;

  @IsOptional()
  @IsNumber()
  @IsIn([2.0], { message: 'SYSTEM_ERROR' })
  api: number;
}
