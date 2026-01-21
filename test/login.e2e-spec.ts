import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = { login: 'AAAAAAAAAAAA@', password: 'test' };

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        console.log(body);
        expect(body.access_token).toBeDefined();
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/auth/login (POST) - failure', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: `${loginDto.password}-password` })
      .expect(401)
      .then(() => {
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  afterAll(() => {
    disconnect();
  });
});
