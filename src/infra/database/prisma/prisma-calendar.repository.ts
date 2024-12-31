import { CalendarRepository } from '@domain/calendar/application/contracts/calendar-repository';
import { Calendar } from '@domain/calendar/enterprise/entities/calendar';
import { CalendarRow } from '@domain/calendar/enterprise/entities/calendar-row';
import {
  parsePrismaCalendarRowToDomainCalendarRow,
  parsePrismaCalendarToDomainCalendar,
} from '@infra/database/prisma/prisma-mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCalendarRepository implements CalendarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(calendar: Calendar): Promise<void> {
    await this.prisma.calendar.create({
      data: {
        id: calendar.id.toString(),
        title: calendar.title,
        description: calendar.description,
        createdAt: calendar.createdAt,
        updatedAt: calendar.updatedAt,
        userId: calendar.userId,
      },
    });
  }
  async findByCalendarByUserId(userId: string): Promise<Calendar | null> {
    const results = await this.prisma.calendar.findUnique({
      where: {
        userId,
      },
      include: {
        rows: true,
      },
    });

    return results ? parsePrismaCalendarToDomainCalendar(results) : null;
  }

  async createRow(row: CalendarRow): Promise<void> {
    await this.prisma.calendarRow.create({
      data: {
        id: row.id.toString(),
        dayOfWeek: row.dayOfWeek,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt ?? undefined,
        calendarId: row.calendarId,
        workId: row.workId,
      },
    });
  }
  async findCalendarById(calendarId: string): Promise<Calendar | null> {
    const results = await this.prisma.calendar.findUnique({
      where: {
        id: calendarId,
      },
      include: {
        rows: true,
      },
    });

    return results ? parsePrismaCalendarToDomainCalendar(results) : null;
  }
  async fetchRowsByCalendarIdAndDayOfWeek(calendarId: string, dayOfWeek: number): Promise<CalendarRow[] | null> {
    const results = await this.prisma.calendarRow.findMany({
      where: {
        calendarId,
        dayOfWeek,
      },
    });

    return results.map(parsePrismaCalendarRowToDomainCalendarRow);
  }
}
