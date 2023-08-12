import { Injectable } from '@nestjs/common';
import { AccessTokenRepository } from '@domain/auth/application/useCases/repositories/access-token-repository';
import { AccessToken } from '@domain/auth/enterprise/entities/AccessToken';
import {
  parseDomainAccessTokenToPrismaAccessToken,
  parsePrismaAccessTokenToDomainAccessToken,
} from '@infra/database/prisma/prisma-mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

@Injectable()
export class PrismaAccessTokenRepository implements AccessTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(accessToken: AccessToken): Promise<void> {
    const data = parseDomainAccessTokenToPrismaAccessToken(accessToken);

    await this.prisma.accessToken.create({
      data: {
        token: data.token,
        createdAt: data.createdAt,
        id: data.id,
        revokedAt: data.revokedAt,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }

  async findByToken(token: string): Promise<AccessToken | undefined> {
    const results = await this.prisma.accessToken.findUnique({
      where: {
        token,
      },
    });

    return results ? parsePrismaAccessTokenToDomainAccessToken(results) : undefined;
  }
}
