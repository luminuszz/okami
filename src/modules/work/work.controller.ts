import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateWorkCommand } from './commands/create-work.command';
@Controller('work')
export class WorkController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createWork(@Body() data: any) {
    await this.commandBus.execute(new CreateWorkCommand(data));
  }

  @Get(':id')
  async getById(@Param('id') id: string) {}

  @Patch(':id/update-chapater')
  async updateChapter(
    @Param('id') id: string,
    @Body('chapter') chapter: number,
  ) {}
}
