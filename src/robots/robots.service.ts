import { Injectable } from '@nestjs/common';

@Injectable()
export class RobotsService {
  getHello(): string {
    return 'Hello World!';
  }
}
