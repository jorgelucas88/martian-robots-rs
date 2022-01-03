import { Controller, Get } from '@nestjs/common';
import { RobotsService } from './robots.service';

@Controller()
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Get()
  getHello(): string {
    return this.robotsService.getHello();
  }
}
