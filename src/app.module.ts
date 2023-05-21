import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkModule } from './modules/work/work.module';

@Module({
  imports: [CqrsModule, WorkModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
