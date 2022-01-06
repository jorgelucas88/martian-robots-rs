import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as fs from 'fs';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
/*
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  */
  // test/files/test1_pdf_example_input.txt
  it('POST /robots/processRobotsMap', async () => {
    const filePath: string = "test/files/test1_pdf_example_input.txt";
    const fileContents: string = await fs.readFileSync(filePath,'utf8');
    return await request(app.getHttpServer())
      .post('/robots/processRobotsMap')
      .attach('file', fileContents)
      .expect(200)
      .expect('Hello World!');
  });
});
