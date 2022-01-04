import { Injectable } from '@nestjs/common';
import { FileService } from 'src/utils/files.service';
import { RobotsMap } from './interfaces/robotmap.interface';
import { RobotsUtils } from './robots.utils';

@Injectable()
export class RobotsService {

  constructor(private fileService: FileService) {}

  async processRobotsMapFromFile(filePath: string): Promise<string> {
    const fileContents: string = await this.fileService.readFile(filePath);
    return await this.processRobotsMap(fileContents);
  }

  processRobotsMap(fileContents: string): string {
    const robotsMap: RobotsMap = RobotsUtils.getRobotMap(fileContents);
    return;
  }
}
