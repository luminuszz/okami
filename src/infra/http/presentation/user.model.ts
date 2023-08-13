import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@domain/auth/enterprise/entities/User';
import { S3FileStorageAdapter } from '@infra/storage/s3FileStorage.adapter';

const userSchema = z
  .object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().email(),
    avatarImageId: z.string().optional().nullable(),
  })
  .transform((data) => ({
    ...data,
    avatarImageUrl: data.avatarImageId ? S3FileStorageAdapter.createWorkImageURL(data.avatarImageId) : null,
  }));

export type UserHttpType = z.infer<typeof userSchema>;

export class UserHttp implements UserHttpType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatarImageUrl: string | null;
  @ApiProperty()
  avatarImageId?: string;
}

export class UserModel {
  static toHttp(user: User): UserHttpType {
    return userSchema.parse(user);
  }
}