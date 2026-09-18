import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get('health')
  health(): Readonly<{ status: 'ok'; scope: 'phase-0-foundation' }> {
    return this.appService.health();
  }
}
