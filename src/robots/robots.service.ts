import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MAX_COORDINATE_VALUE, MAX_INSTRUCTIONS_STRING_LENGTH, VALID_INSTRUCTIONS } from '../constants';
import { FileService } from '../utils/files.service';
import { RobotMapRun } from './entities/robotmaprun.entity';
import { RobotsMap, Position, RobotInstruction } from './interfaces/robotmap.interface';
import { RobotsUtils } from './robotsmap.utils';

@Injectable()
export class RobotsService {

  constructor(
    private fileService: FileService,
    @InjectRepository(RobotMapRun)
    private robotMapRunRepository: Repository<RobotMapRun>
    ) { }

  public async processRobotsMapFromFile(filePath: string): Promise<string> {
    const fileContents: string = await this.fileService.readFile(filePath);
    const robotsMap: RobotsMap = RobotsUtils.getRobotMap(fileContents);
    console.info("PROCESSING FILE:\n");
    return this.processRobotsMap(robotsMap);
  }

  public async processRobotsMap(robotsMap: RobotsMap | string, rawFileContents?: string): Promise<string> {

    if (typeof robotsMap === "string") {
      robotsMap = RobotsUtils.getRobotMap(robotsMap);
    }
    
    this.validateRobotsMap(robotsMap);
    
    const robotsMovementsOutput: Position[] = this.processRobotInstructions(robotsMap);
    
    const result: string = robotsMovementsOutput.map(m => { return `${m.x} ${m.y} ${m.orientation}${m.isLost ? " LOST" : ""}\n`}).join("");

    await this.insertRobotsMapRunStatistics(rawFileContents, result, robotsMap.exploredSurface, robotsMap.lostRobots);

    return result;
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
      const finalPosition: Position = RobotsUtils.calculateFinalPosition(r.position, r.instructions, (<RobotsMap> robotsMap).mapSize, scentedPositions);
      robotsMovementsOutput.push(finalPosition);
      finalPosition.isLost ? scentedPositions.push(finalPosition) : "";
      robotsMap.exploredSurface = robotsMap.exploredSurface + finalPosition.exploredSurface
    });

    robotsMap.lostRobots = scentedPositions.length;

    return robotsMovementsOutput;
  }

  public async createRobotMapRun(r: RobotMapRun): Promise<RobotMapRun> {
    return await this.robotMapRunRepository.save(r);
  }

  public async getAllRobotMapRun(page: number, pageSize: number): Promise<[RobotMapRun[], number]> {
    return await this.robotMapRunRepository.findAndCount({
      skip: page && page > 0 && pageSize ? (page - 1) * pageSize : 0,
      take: pageSize
    });
  }

  public async insertRobotsMapRunStatistics(rawInput: string, output: string, exploredSurface: number, lostRobots: number) {
    return await this.createRobotMapRun({
      id: null,
      date: new Date(),
      input: rawInput,
      output: output,
      exploredSurface: exploredSurface,
      lostRobots: lostRobots
    });
  }
  

}
