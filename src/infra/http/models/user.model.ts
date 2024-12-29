import { CloudFlareR2StorageAdapter } from '@app/infra/storage/cloudFlare-r2-storage.adapter';
import { User, UserRole } from '@domain/auth/enterprise/entities/User';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentSubscriptionStatus } from '@prisma/client';
import { z } from 'zod';

const userSchema = z
  .object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().email(),
    avatarImageId: z.string().optional().nullable(),
    finishedWorksCount: z.number().default(0),
    readingWorksCount: z.number().default(0),
    notionDatabaseId: z.string().nullable(),
    paymentSubscriptionStatus: z.nativeEnum(PaymentSubscriptionStatus).optional(),
    role: z.nativeEnum(UserRole),
  })
  .transform((data) => ({
    ...data,
    avatarImageUrl: data.avatarImageId ? CloudFlareR2StorageAdapter.createS3AvatarUrl(data.avatarImageId) : null,
  }));

export type UserHttpType = z.infer<typeof userSchema>;

export class UserHttp implements UserHttpType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true, type: String })
  avatarImageUrl: string | null;

  @ApiPropertyOptional()
  avatarImageId?: string;

  @ApiProperty()
  finishedWorksCount: number;

  @ApiProperty()
  readingWorksCount: number;

  @ApiPropertyOptional()
  notionDatabaseId?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

export class UserModel {
  static toHttp(user: User): UserHttpType {
    return userSchema.parse(user);
  }
}
