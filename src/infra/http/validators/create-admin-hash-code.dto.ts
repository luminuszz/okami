import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminHashCodeDto {
  @IsString()
  @IsNotEmpty()
  hashCodeKey: string;
}
