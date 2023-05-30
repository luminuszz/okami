import { Module } from '@nestjs/common';
import { WorkController } from './work.controller';

@Module({
  imports: [],
  controllers: [WorkController],
})
export class HttpModule {}
