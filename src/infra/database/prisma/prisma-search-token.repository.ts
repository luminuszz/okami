import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';
import { SearchToken } from '@domain/work/enterprise/entities/search-token';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

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

  async createMany(searchTokens: SearchToken[]): Promise<void> {
    await this.prisma.searchToken.createMany({
      data: searchTokens.map((vl) => ({
        id: vl.id,
        createdAt: vl.createdAt,
        token: vl.token,
      })),
    });
  }
}
