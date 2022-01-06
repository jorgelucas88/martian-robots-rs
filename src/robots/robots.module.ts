import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../utils/files.service';
import { RobotMapRun } from './entities/robotmaprun.entity';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';

@Module({
  imports: [TypeOrmModule.forFeature([RobotMapRun])],
  controllers: [RobotsController],
  providers: [RobotsService, FileService],
  exports: [],
})
export class RobotsModule {}
