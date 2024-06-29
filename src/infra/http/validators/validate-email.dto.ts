import { IsUUID } from 'class-validator';

export class ValidateEmailDto {
  @IsUUID()
  code: string;
}
