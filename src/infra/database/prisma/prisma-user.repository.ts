import { UserRepository } from '@domain/auth/application/useCases/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { User } from '@domain/auth/enterprise/entities/User';
import { parseDomainUserToPrismaUser, parsePrismaUserToDomainUser } from '@infra/database/prisma/prisma-mapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = parseDomainUserToPrismaUser(user);

    await this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const results = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return results ? parsePrismaUserToDomainUser(results) : undefined;
  }
}
