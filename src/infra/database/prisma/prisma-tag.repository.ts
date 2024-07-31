import { TagRepository } from '@domain/work/application/repositories/tag-repository';
import { Tag } from '@domain/work/enterprise/entities/tag';
import { Injectable } from '@nestjs/common';
import { Tag as PrismaTag } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Slug } from '@domain/work/enterprise/entities/values-objects/slug';
import { UniqueEntityID } from '@core/entities/unique-entity-id';
import { prismaTagToEntityTag } from './prisma-mapper';
import { map } from 'lodash';

@Injectable()
export class PrismaTagRepository implements TagRepository {
  constructor(private prisma: PrismaService) {}

  async findAllTagsByWorkId(workId: string): Promise<Tag[]> {
    const { tags } = await this.prisma.work.findUnique({
      where: {
        id: workId,
      },
      select: {
        tags: true,
      },
    });

    return map(tags, prismaTagToEntityTag);
  }
  async updateTagList(workId: string, tagsToAdd: string[], tagsToRemove: string[]): Promise<void> {
    console.log('tagsToAdd', tagsToAdd);
    console.log('tagsToRemove', tagsToRemove);

    await this.prisma.work.update({
      where: {
        id: workId,
      },
      data: {
        tags: {
          connect: tagsToAdd.map((tagId) => ({
            id: tagId,
          })),
          disconnect: tagsToRemove.map((tagId) => ({
            id: tagId,
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async linkTagToWork(workId: string, tagId: string): Promise<void> {
    await this.prisma.work.update({
      where: {
        id: workId,
      },
      data: {
        tags: {
          connect: {
            id: tagId,
          },
        },
      },
    });
  }

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
        color: tag.color,
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
        color: tag.color,
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

  async updateTagColorBatch(tags: Tag[]) {
    try {
      const operations = tags.map((tag) => {
        return this.prisma.tag.update({
          where: {
            slug: tag.slug,
          },
          data: {
            color: tag.color,
          },
        });
      });

      await this.prisma.$transaction(operations);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchAllTagsPaged(page: number): Promise<{ tags: Tag[]; totalOfPages: number }> {
    const limit = 20;

    const [results, totalOfTags] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
        skip: page * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.tag.count(),
    ]);

    return {
      tags: results.map(prismaTagToEntityTag),
      totalOfPages: Math.ceil(totalOfTags / limit),
    };
  }
}
