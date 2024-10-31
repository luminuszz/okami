import { IsPublic } from '@app/infra/crqs/auth/auth.guard';
import { Controller, Get, Response } from '@nestjs/common';
import swaggerFile from '../../../../swagger.json';

@Controller('static')
export class AppController {
  @IsPublic()
  @Get('/swagger')
  async getSwagger(@Response() reply: any) {
    return reply.header('Content-Type', 'application/json; charset=utf-8').send(swaggerFile);
  }
}
