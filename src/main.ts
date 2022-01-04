import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RobotsService } from './robots/robots.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const command = process.argv[2];
  switch(command) {
    case "robots-cli":
      console.log("TBD robots cli");
      break;
    case "robots-cli-file":
      const robotsService: RobotsService = app.get(RobotsService);
      const filePath: string = process.argv[3];
      const robotProcessingOutput: string = await robotsService.processRobotsMapFromFile(filePath);
      console.log(robotProcessingOutput);
      break;
    default:
      await app.listen(3000);
  }
}
bootstrap();
