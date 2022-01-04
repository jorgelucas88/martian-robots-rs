import { Injectable } from '@nestjs/common';
import { FileService } from 'src/utils/files.service';
import { RobotsMap, Position } from './interfaces/robotmap.interface';
import { RobotsUtils } from './robots.utils';

@Injectable()
export class RobotsService {

  constructor(private fileService: FileService) {}

  public async processRobotsMapFromFile(filePath: string): Promise<string> {
    const fileContents: string = await this.fileService.readFile(filePath);
    const robotsMap: RobotsMap = RobotsUtils.getRobotMap(fileContents);
    console.info("PROCESSING FILE:\n");
    return this.processRobotsMap(robotsMap);
  }

  public processRobotsMap(robotsMap: RobotsMap): string {
    const robotsMovementsOutput: Position[] = [];
    robotsMap.robotInstructions.forEach(r => {
      robotsMovementsOutput.push(RobotsUtils.calculateFinalPosition(r.position, r.instructions, robotsMap.mapSize));
    });
    
    return robotsMovementsOutput.map(m => { return `${m.x} ${m.y} ${m.orientation}${m.isLost ? " LOST" : ""}\n`}).join("");
  }

}
