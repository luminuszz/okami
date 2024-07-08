import { SearchTokenRepository } from '@domain/work/application/repositories/search-token-repository';
import { SearchToken, SearchTokenType } from '@domain/work/enterprise/entities/search-token';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { parsePrismaSearchTokenToDomain } from '@infra/database/prisma/prisma-mapper';

@Injectable()
export class PrismaSearchTokenRepository implements SearchTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: SearchToken): Promise<void> {
    await this.prisma.searchToken.create({
      data: {
        token: data.token,
        createdAt: data.createdAt,
        id: data.id,
        type: data.type,
      },
    });
  }

  async createMany(searchTokens: SearchToken[]): Promise<void> {
    await this.prisma.searchToken.createMany({
      data: searchTokens.map((data) => ({
        id: data.id,
        createdAt: data.createdAt,
        token: data.token,
        type: data.type,
      })),
    });
  }

  async fetchByType(type: SearchTokenType): Promise<SearchToken[]> {
    const results = await this.prisma.searchToken.findMany({
      where: {
        type,
      },
    });

    return results.map(parsePrismaSearchTokenToDomain);
  }
}
