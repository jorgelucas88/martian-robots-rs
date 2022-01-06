import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../../utils/files.service';
import { RobotMapRun } from '../entities/robotmaprun.entity';
import { RobotsMap } from '../interfaces/robotmap.interface';
import { RobotsController } from '../robots.controller';
import { RobotsService } from '../robots.service';

import * as fs from 'fs';
import { LINE_BREAK } from '../interfaces/robotfile.interface';

describe('RobotsController', () => {
  let robotsController: RobotsController;
  let robotsService: RobotsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [RobotsController],
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

    robotsController = app.get<RobotsController>(RobotsController);
    robotsService = app.get<RobotsService>(RobotsService);
  });

  describe('Robots controller - POST /processRobotsMap', () => {
    it('Positive tests', async () => {
      const testFolder: string = "test/files";
      const files: string[] = fs.readdirSync(testFolder);
      let positiveTests: number = 0;

      for (let i = 1; i < files.length/2; i ++) {
        const testFileInput: string = files.find(f => f.startsWith(`test${i}_`) && f.includes(`input`));
        const testFileOutput: string = files.find(f => f.startsWith(`test${i}_`) && f.includes(`output`));

        if (testFileInput.includes("negative")) {
          continue;
        }
        
        const inputPath: string = `test/files/${testFileInput}`;
        const inputContents: string = await fs.readFileSync(inputPath,'utf8');

        const outputPath: string = `test/files/${testFileOutput}`;
        const outputContents: string = await fs.readFileSync(outputPath,'utf8')
      
        const file: Express.Multer.File = { 
          fieldname: '',
          encoding: '',
          size: 10,
          stream: null,
          destination: '',
          filename: '',
          originalname: 'sample.name',
          mimetype: 'sample.type',
          path: 'sample.url',
          buffer: Buffer.from(inputContents), // this is required since `formData` needs access to the buffer
        };
        const expectedResponse: string = outputContents;
        const controllerResponse = await robotsController.processRobotsMap(file);
        
        expect(controllerResponse).toMatch(expectedResponse);
        positiveTests++;
      }
      
      console.info(`Robots controller integration tests - Total positive tests performed: ${positiveTests}`);
    });

    it('Negative tests', async () => {
      const testFolder: string = "test/files";
      const files: string[] = fs.readdirSync(testFolder);
      let negativeTests: number = 0;
      
      for (let i = 1; i < files.length/2; i ++) {
        const testFileInput: string = files.find(f => f.startsWith(`test${i}_`) && f.includes(`input`));
        const testFileOutput: string = files.find(f => f.startsWith(`test${i}_`) && f.includes(`output`));

        if (!testFileInput.includes("negative")) {
          continue;
        }
        
        const inputPath: string = `test/files/${testFileInput}`;
        const inputContents: string = await fs.readFileSync(inputPath,'utf8');

        const outputPath: string = `test/files/${testFileOutput}`;
        const outputContents: string = await fs.readFileSync(outputPath,'utf8')
      
        const file: Express.Multer.File = { 
          fieldname: '',
          encoding: '',
          size: 10,
          stream: null,
          destination: '',
          filename: '',
          originalname: 'sample.name',
          mimetype: 'sample.type',
          path: 'sample.url',
          buffer: Buffer.from(inputContents), // this is required since `formData` needs access to the buffer
        };
        const expectedResponse: string = outputContents;
        try {
          const controllerResponse = await robotsController.processRobotsMap(file);
        } catch(e) {
          expect(e.message).toBe(expectedResponse);
        }
        negativeTests++;
      }
      console.info(`Robots controller integration tests - Total negative tests performed: ${negativeTests}`);
    });
    
  });

  describe('Robots controller - GET /getAllRobotMapRun', () => {
    it('getAllRobotMapRun', async () => {
      const expectedResponse: any = null;
      jest.spyOn(robotsService, "getAllRobotMapRun").mockImplementationOnce((): Promise<[RobotMapRun[], number]> => { return new Promise<[RobotMapRun[], number]>((resolve, reject) => { resolve([[], 0]); }) });

      const page: number = 1;
      const pageSize: number = 15;
      const req: any = { query: { page: page, pageSize: pageSize }};
      try {
        const controllerResult = await robotsController.getAllRobotMapRun(req);
        expect(controllerResult).toStrictEqual([[], 0]);
      } catch(e) {
        expect(e).toBeUndefined();
      }
    });
  });
});
