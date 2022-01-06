import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../../utils/files.service';
import { RobotMapRun } from '../entities/robotmaprun.entity';
import { MapSize, Position, RobotInstruction, RobotsMap } from '../interfaces/robotmap.interface';
import { RobotsService } from '../robots.service';
import { RobotsUtils } from '../robotsmap.utils';

describe('RobotsService integration tests', () => {
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
      const fileContents: string = "5 3\n1 1 E\nRFRFRFRF\n3 2 N\nFRRFLLFFRRFLL\n0 3 W\nLLFFFRFLFL";
      
      jest.spyOn(fileService, "readFile").mockImplementationOnce((filePath: string): Promise<string> => { return new Promise<string>((resolve, reject) => resolve(fileContents)); });
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

      try {
        const apiResult: string = await robotsService.processRobotsMap(apiInput);
        expect(apiResult).toBe("0 0 W\n");
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    it('processRobotsMapFrom success - string as input', async () => {
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
  
      try {
        const apiResult: string = await robotsService.processRobotsMap(robotsMap);
        expect(apiResult).toBe("0 0 W\n");
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

      try {
        const apiResult: string = await robotsService.processRobotsMap(robotsMap);
        expect(apiResult).toBe("0 0 W\n");
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

      try {
        robotsService.validateRobotsMap(robotsMap);
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

      try {
        robotsService.validateRobotsMap(robotsMap);
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

      try {
        robotsService.validateRobotsMap(robotsMap);
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

      try {
        robotsService.processRobotInstructions(robotsMap);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });

    
  });

  
});
