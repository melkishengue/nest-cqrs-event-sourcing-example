import { Controller, Get } from '@nestjs/common';

const id = (Math.random() + 1).toString(36).substring(7);

@Controller()
export class AppController {
  @Get('/')
  async displayId() {
    return id;
  }
}
