import { Module } from '@nestjs/common';
import { FileService } from 'src/utils/files.service';
import { RobotsController } from './robots.controller';
import { RobotsService } from './robots.service';

@Module({
  imports: [],
  controllers: [RobotsController],
  providers: [RobotsService, FileService],
  exports: [],
})
export class RobotsModule {}
