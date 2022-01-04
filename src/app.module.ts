import { Module } from '@nestjs/common';
import { RobotsController } from './robots/robots.controller';
import { RobotsModule } from './robots/robots.module';
import { RobotsService } from './robots/robots.service';
import { FileService } from './utils/files.service';

@Module({
  imports: [RobotsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
