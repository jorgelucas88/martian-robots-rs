import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../../utils/files.service';
import { RobotsMap } from '../interfaces/robotmap.interface';
import { RobotsController } from '../robots.controller';
import { RobotsService } from '../robots.service';

describe('RobotsController', () => {
  let robotsController: RobotsController;
  let robotsService: RobotsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RobotsController],
      providers: [RobotsService, FileService],
    }).compile();

    robotsController = app.get<RobotsController>(RobotsController);
    robotsService = app.get<RobotsService>(RobotsService);
  });

  describe('Robots controller', () => {
    it('No file - should return No file', async () => {
      const file: Express.Multer.File = null;
      const expectedResponse: string = "No file"
      jest.spyOn(robotsService, "processRobotsMap").mockImplementationOnce((robotsMap: string | RobotsMap): string => { return expectedResponse });

      try {
        expect(await robotsController.processRobotsMap(file));
      } catch(e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe(expectedResponse);
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
      const expectedResponse: string = ""
      jest.spyOn(robotsService, "processRobotsMap").mockImplementationOnce((robotsMap: string | RobotsMap): string => {return expectedResponse});

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
      const expectedResponse: string = ""
      jest.spyOn(robotsService, "processRobotsMap").mockImplementationOnce((robotsMap: string | RobotsMap): string => {return expectedResponse});

      const controllerResponse = await robotsController.processRobotsMap(file);
      expect(controllerResponse).toBe(expectedResponse);
      expect(robotsService.processRobotsMap).toBeCalled();
    });
  });
});
