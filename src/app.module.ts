import { Module } from '@nestjs/common';
import { RobotsController } from './robots/robots.controller';
import { RobotsService } from './robots/robots.service';

@Module({
  imports: [],
  controllers: [RobotsController],
  providers: [RobotsService],
})
export class AppModule {}
