import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../../utils/files.service';
import { RobotMapRun } from '../entities/robotmaprun.entity';
import { MapSize, Position, RobotInstruction, RobotsMap } from '../interfaces/robotmap.interface';
import { RobotsService } from '../robots.service';
import { RobotsUtils } from '../robotsmap.utils';

describe('RobotsService', () => {
  let robotsService: RobotsService;
  let fileService: FileService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [RobotsService, 
        FileService,
        { // mock for RobotMapRun repository
          provide: getRepositoryToken(RobotMapRun),
          useValue: {
            save: jest.fn().mockResolvedValue(""),
            find: jest.fn().mockResolvedValue([""]),
          },
        }],
    }).compile();

    robotsService = app.get<RobotsService>(RobotsService);
    fileService = app.get<FileService>(FileService);

    // avoiding undesired console logging along showing jest results
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
  });

  describe('processRobotsMapFromFile', () => {
    it('processRobotsMapFromFile success', async () => {
      const filePath: string = "dummyFilePath";
      
      jest.spyOn(fileService, "readFile").mockImplementationOnce((filePath: string): Promise<string> => { return; });
      jest.spyOn(RobotsUtils, "getRobotMap").mockImplementationOnce((fileContents: string): RobotsMap => { return; });
      jest.spyOn(robotsService, "processRobotsMap").mockImplementationOnce((fileContents: string | RobotsMap): Promise<string> => { return; });

      try {
        await robotsService.processRobotsMapFromFile(filePath);
      } catch (e) {
        expect(e).toBeUndefined();
      }

    });
  });

  describe('processRobotsMap', () => {
    it('processRobotsMapFrom success - RobotMap as input', async () => {
      const apiInput: RobotsMap = {
        mapSize: { axisX: 2, axisY: 2 },
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false,
            exploredSurface: 0 },
            instructions: ["L"]
          } 
        ],
        exploredSurface: 0,
        lostRobots: 0
      };

      jest.spyOn(robotsService, "validateRobotsMap").mockImplementationOnce((robotsMap: RobotsMap): void => { return; });
      jest.spyOn(robotsService, "processRobotInstructions").mockImplementationOnce((robotsMap: RobotsMap): Position[] => { return [{ x: 1, y: 1, orientation: "N", isLost: true,
      exploredSurface: 0 }]; });

      try {
        robotsService.processRobotsMap(apiInput);
        expect(robotsService.validateRobotsMap).toBeCalled();
        expect(robotsService.processRobotInstructions).toBeCalled();
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('processRobotsMapFrom success - string as input', async () => {
      const apiInputString: string = "2 2\n0 0 N\nL";
      const robotsMap: RobotsMap = {
        mapSize: { axisX: 2, axisY: 2 },
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false,
            exploredSurface: 0 },
            instructions: ["L"]
          } 
        ],
        exploredSurface: 0,
        lostRobots: 0
      };
  
      jest.spyOn(RobotsUtils, "getRobotMap").mockImplementationOnce((fileContents: string): RobotsMap => { return robotsMap; });
      jest.spyOn(robotsService, "validateRobotsMap").mockImplementationOnce((robotsMap: RobotsMap): void => { return; });
      jest.spyOn(robotsService, "processRobotInstructions").mockImplementationOnce((robotsMap: RobotsMap): Position[] => { return []; });
  
      try {
        robotsService.processRobotsMap(apiInputString);
        expect(robotsService.validateRobotsMap).toBeCalled();
        expect(robotsService.processRobotInstructions).toBeCalled();
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });
  });

  describe('validateRobotsMap', () => {
    it('validateRobotsMap success - valid coordinates and valid instructions', async () => {
      
      const robotsMap: RobotsMap = {
        mapSize: { axisX: 2, axisY: 2 },
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false,
            exploredSurface: 0 },
            instructions: ["L"]
          } 
        ],
        exploredSurface: 0,
        lostRobots: 0
      };

      jest.spyOn(RobotsUtils, "allCordinatesAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return true; });
      jest.spyOn(RobotsUtils, "allInstructionsAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return true; });


      try {
        robotsService.validateRobotsMap(robotsMap);
        expect(RobotsUtils.allCordinatesAreValid).toBeCalled();
        expect(RobotsUtils.allInstructionsAreValid).toBeCalled();
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('validateRobotsMap failure - invalid coordinates and invalid instructions', async () => {
      
      const robotsMap: RobotsMap = {
        mapSize: { axisX: 2, axisY: 2 },
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false,
            exploredSurface: 0 },
            instructions: ["L"]
          } 
        ],
        exploredSurface: 0,
        lostRobots: 0
      };

      jest.spyOn(RobotsUtils, "allCordinatesAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return false; });
      jest.spyOn(RobotsUtils, "allInstructionsAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return false; });


      try {
        robotsService.validateRobotsMap(robotsMap);
        expect(RobotsUtils.allCordinatesAreValid).toBeCalled();
        expect(RobotsUtils.allInstructionsAreValid).toBeCalled();
      } catch(e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('validateRobotsMap failure - valid coordinates and invalid valid instructions', async () => {
      
      const robotsMap: RobotsMap = {
        mapSize: { axisX: 2, axisY: 2 },
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false,
            exploredSurface: 0 },
            instructions: ["L"]
          } 
        ],
        exploredSurface: 0,
        lostRobots: 0
      };

      jest.spyOn(RobotsUtils, "allCordinatesAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return true; });
      jest.spyOn(RobotsUtils, "allInstructionsAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return false; });


      try {
        robotsService.validateRobotsMap(robotsMap);
        expect(RobotsUtils.allCordinatesAreValid).toBeCalled();
        expect(RobotsUtils.allInstructionsAreValid).toBeCalled();
      } catch(e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('validateRobotsMap failure - invalid coordinates and valid instructions', async () => {
      
      const robotsMap: RobotsMap = {
        mapSize: { axisX: 2, axisY: 2 },
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false,
            exploredSurface: 0 },
            instructions: ["L"]
          } 
        ],
        exploredSurface: 0,
        lostRobots: 0
      };

      jest.spyOn(RobotsUtils, "allCordinatesAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return false; });
      jest.spyOn(RobotsUtils, "allInstructionsAreValid").mockImplementationOnce((robotsMap: RobotsMap): boolean => { return true; });


      try {
        robotsService.validateRobotsMap(robotsMap);
        expect(RobotsUtils.allCordinatesAreValid).toBeCalled();
        expect(RobotsUtils.allInstructionsAreValid).toBeCalled();
      } catch(e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('processRobotInstructions', () => {
    it('processRobotInstructions success', async () => {
      
      const robotsMap: RobotsMap = {
        mapSize: { axisX: 2, axisY: 2 },
        robotInstructions: [
          { 
            position: { x: 0, y: 0, orientation: "N", isLost: false,
            exploredSurface: 0 },
            instructions: ["L"]
          } 
        ],
        exploredSurface: 0,
        lostRobots: 0
      };

      jest.spyOn(RobotsUtils, "calculateFinalPosition").mockImplementationOnce((initialPosition: Position, instructions: string[], mapSize: MapSize, scentedPositions: Position[]): Position => { return { x: 1, y: 1, orientation: "N", isLost: true,
      exploredSurface: 0 }; });


      try {
        robotsService.processRobotInstructions(robotsMap);
        expect(RobotsUtils.calculateFinalPosition).toBeCalled();
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    
  });

  
});
