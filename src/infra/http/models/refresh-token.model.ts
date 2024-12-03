import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenModel {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;
}

export class RefreshTokenOnlyModel {
  @ApiProperty()
  refreshToken: string;
}
