import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MakeSessionDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
