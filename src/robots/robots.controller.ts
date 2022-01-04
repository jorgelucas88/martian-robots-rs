import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { RobotsService } from './robots.service';

@Controller("robots")
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Post("processRobotsMap")
  async processRobotsMap(@Body() body: string, @Req() req): Promise<string> {
    return await this.robotsService.processRobotsMapFromFile("test/files/test1_input.txt");
  }
}
