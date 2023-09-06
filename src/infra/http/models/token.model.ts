import { ApiProperty } from '@nestjs/swagger';

export class TokenModel {
  @ApiProperty()
  token: string;
}

export class AccessToken {
  @ApiProperty()
  accessToken: string;
}
