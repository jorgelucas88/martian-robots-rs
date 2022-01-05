import { BadRequestException, Body, Controller, Get, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RobotsService } from './robots.service';

@Controller("robots")
export class RobotsController {
  constructor(private readonly robotsService: RobotsService) {}

  @Post("processRobotsMap")
  @UseInterceptors(FileInterceptor('file'))
  async processRobotsMap(@UploadedFile() file: Express.Multer.File): Promise<string> {
    if (file) {
      const fileContents: string = Buffer.from(file.buffer).toString();
    
      return this.robotsService.processRobotsMap(fileContents);
    } else {
      throw new BadRequestException("No file");
    }
  }
}
