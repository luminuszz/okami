import { RefreshTokenRepository } from '@domain/auth/application/useCases/repositories/refresh-token-repository';
import { RefreshToken } from '@domain/auth/enterprise/entities/RefreshToken';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(refreshToken: RefreshToken): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        expiresAt: refreshToken.expiresAt,
        id: refreshToken.id,
        token: refreshToken.token,
        userId: refreshToken.userId,
      },
    });
  }
}
