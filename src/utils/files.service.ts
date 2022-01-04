import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class FileService {
  async readFile(filePath: string) {
    return await fs.readFileSync(filePath,'utf8');
  }
}
