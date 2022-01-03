import { Test, TestingModule } from '@nestjs/testing';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';

describe('RobotsController', () => {
  let robotsController: RobotsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RobotsController],
      providers: [RobotsService],
    }).compile();

    robotsController = app.get<RobotsController>(RobotsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(robotsController.getHello()).toBe('Hello World!');
    });
  });
});
