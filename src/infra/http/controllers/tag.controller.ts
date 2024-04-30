import { CreateTagCommand } from '@app/infra/crqs/work/commands/create-tag.command';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('tags')
export class TagController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async create(@Body('name') name: string) {
    if (!name) {
      throw new BadRequestException('Name is required');
    }

    await this.commandBus.execute(new CreateTagCommand(name));
  }
}
