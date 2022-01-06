import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../../utils/files.service';
import { RobotMapRun } from '../entities/robotmaprun.entity';
import { RobotsMap } from '../interfaces/robotmap.interface';
import { RobotsController } from '../robots.controller';
import { RobotsService } from '../robots.service';

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
    it('No file - bad request exception', async () => {
      const file: Express.Multer.File = null;
      const expectedResponse: Promise<string> = new Promise((resolve, reject) => resolve("No file"));
      jest.spyOn(robotsService, "processRobotsMap").mockImplementationOnce((robotsMap: string | RobotsMap): Promise<string> => { return expectedResponse });

      try {
        await robotsController.processRobotsMap(file);
      } catch(e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('Empty file', async () => {
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
        buffer: Buffer.from(""), // this is required since `formData` needs access to the buffer
      };
      const expectedResponse: Promise<string> = null;
      jest.spyOn(robotsService, "processRobotsMap").mockImplementationOnce((robotsMap: string | RobotsMap): Promise<string> => {return expectedResponse});

      const controllerResponse = await robotsController.processRobotsMap(file);
      expect(controllerResponse).toBe(expectedResponse);
      expect(robotsService.processRobotsMap).toBeCalled();
    });

    it('Random file', async () => {
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
        buffer: Buffer.from('some random file'), // this is required since `formData` needs access to the buffer
      };
      const expectedResponse: Promise<string> = null;
      jest.spyOn(robotsService, "processRobotsMap").mockImplementationOnce((robotsMap: string | RobotsMap): Promise<string> => { return expectedResponse });

      const controllerResponse = await robotsController.processRobotsMap(file);
      expect(controllerResponse).toBe(expectedResponse);
      expect(robotsService.processRobotsMap).toBeCalled();
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
