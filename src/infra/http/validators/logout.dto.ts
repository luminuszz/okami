import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({ nullable: true, type: String })
  refreshToken: string | null;
}
