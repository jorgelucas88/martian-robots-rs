import { Test, TestingModule } from '@nestjs/testing';
import { PathOrFileDescriptor } from 'fs';
import { FileService } from '../files.service';
const fs = require('fs');

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [FileService],
    }).compile();

    fileService = app.get<FileService>(FileService);

    // avoiding undesired console logging along showing jest results
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "info").mockImplementation();
  });

  describe('fileService', () => {
    it('readFile success', async () => {
      const filePath: string = "";
    
      jest.spyOn(fs, 'readFileSync').mockImplementationOnce((path: PathOrFileDescriptor,
        options:
            | {
                  encoding: BufferEncoding;
                  flag?: string | undefined;
              }
            | BufferEncoding) => { return ""; });

      try {
        await fileService.readFile(filePath);
      } catch (e) {
        expect(e).toBeUndefined();
      }

    });
  });

});
