import { IsIn, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { EMailType } from '../enums/mail-type.enum';

export class CancelMessageDtoStructure {
  @IsNumber()
  $TASK_ID: number;

  @IsOptional()
  @IsString()
  @IsIn(['json', 'text'])
  $TYPE?: string;
}
