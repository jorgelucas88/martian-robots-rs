import { BadRequestException, Injectable } from '@nestjs/common';
import { type } from 'os';
import { MAX_COORDINATE_VALUE, MAX_INSTRUCTIONS_STRING_LENGTH, VALID_INSTRUCTIONS } from '../constants';
import { FileService } from '../utils/files.service';
import { RobotsMap, Position, RobotInstruction } from './interfaces/robotmap.interface';
import { RobotsUtils } from './robotsmap.utils';

@Injectable()
export class RobotsService {

  constructor(private fileService: FileService) { }

  public async processRobotsMapFromFile(filePath: string): Promise<string> {
    const fileContents: string = await this.fileService.readFile(filePath);
    const robotsMap: RobotsMap = RobotsUtils.getRobotMap(fileContents);
    console.info("PROCESSING FILE:\n");
    return this.processRobotsMap(robotsMap);
  }

  public processRobotsMap(robotsMap: RobotsMap | string): string {

    if (typeof robotsMap === "string") {
      robotsMap = RobotsUtils.getRobotMap(robotsMap);
    }
    
    this.validateRobotsMap(robotsMap);
    const robotsMovementsOutput: Position[] = this.processRobotInstructions(robotsMap);
    
    return robotsMovementsOutput.map(m => { return `${m.x} ${m.y} ${m.orientation}${m.isLost ? " LOST" : ""}\n`}).join("");
  }

  public validateRobotsMap(robotsMap: RobotsMap): void {
    
    if (!RobotsUtils.allCordinatesAreValid(robotsMap)) {
      throw new BadRequestException(`Coordinates must be positive and have a maximum of ${MAX_COORDINATE_VALUE} and robots must be placed within the declared map!`);
    } else if (!RobotsUtils.allInstructionsAreValid(robotsMap)) {
      throw new BadRequestException(`Instructions must be ${VALID_INSTRUCTIONS} and maximum length of ${MAX_INSTRUCTIONS_STRING_LENGTH}`);
    }
  }

  public processRobotInstructions(robotsMap: RobotsMap): Position[] {
    const robotsMovementsOutput: Position[] = [];
    const scentedPositions: Position[] = [];
    
    robotsMap.robotInstructions.forEach(r => {
      const robotFinalPosition: Position = RobotsUtils.calculateFinalPosition(r.position, r.instructions, (<RobotsMap> robotsMap).mapSize, scentedPositions);
      robotsMovementsOutput.push(robotFinalPosition);
      robotFinalPosition.isLost ? scentedPositions.push(robotFinalPosition) : "";
    });

    return robotsMovementsOutput;
  }

}
