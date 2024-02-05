import { IsIn, IsNumber, IsNumberString, IsOptional, IsString, IsUrl } from 'class-validator';
import { EMailType } from '../enums/mail-type.enum';
import { Transform } from 'class-transformer';

export class GetMessageDtoStructure {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  $TASK_ID: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsIn([0, 1])
  $FULL: number;

  @IsOptional()
  @IsString()
  @IsIn(['json', 'text'])
  $TYPE?: string;
}
