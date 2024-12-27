import { IsObjectId } from '@app/infra/utils/IsObjectId';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetWorkUploadUrlDto {
  @IsString()
  @ApiProperty()
  @IsObjectId()
  workId: string;

  @ApiProperty()
  @IsNotEmpty()
  fileType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
