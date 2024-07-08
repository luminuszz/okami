import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { SearchToken } from '@domain/work/enterprise/entities/search-token';

@Injectable()
export class PrismaSearchTokenRepository implements SearchTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: SearchToken): Promise<void> {
    await this.prisma.searchToken.create({
      data: {
        token: data.token,
        createdAt: data.createdAt,
        id: data.id,
      },
    });
  }
}
