import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Injectable } from '@nestjs/common';
import { Tag as PrismaTag } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { UniqueEntityID } from '@core/entities/unique-entity-id';

@Injectable()
export class PrismaTagRepository implements TagRepository {
  constructor(private prisma: PrismaService) {}

  private toEntity(tag: PrismaTag): Tag {
    return Tag.create(
      {
        name: tag.name,
        slug: new Slug(tag.slug),
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      },
      new UniqueEntityID(tag.id),
    );
  }

  async create(tag: Tag): Promise<void> {
    await this.prisma.tag.create({
      data: {
        createdAt: tag.createdAt,
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        updatedAt: tag.updatedAt,
      },
    });
  }
  async save(tag: Tag): Promise<void> {
    await this.prisma.tag.update({
      data: {
        name: tag.name,
        slug: tag.slug,
        updatedAt: tag.updatedAt,
      },
      where: {
        id: tag.id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tag.delete({
      where: {
        id,
      },
    });
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        slug,
      },
    });

    return tag ? this.toEntity(tag) : null;
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({
      where: {
        id,
      },
    });

    return tag ? this.toEntity(tag) : null;
  }
}
