import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Тест',
  title: 'Заголовок',
  description: 'Описание',
  rating: 0,
  productId,
};

const loginDto: AuthDto = { login: 'AAAAAAAAAAAA@', password: 'test' };

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    token = body.access_token;
  });

  it('/review/create (POST) - success', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/review/create (POST) - failure', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: -1 })
      .expect(400)
      .then((response) => {
        console.log(response);
        done();
      })

      .catch((error) => {
        console.log(error);
      });
  });

  it('/review/by/product/:productId (GET) - success', (done) => {
    request(app.getHttpServer())
      .get(`/review/by/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200)
      .then(({ body }: request.Response) => {
        console.log(body, productId, createdId);
        expect(body.length).toBeGreaterThan(0);
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/review/by/product/:productId (GET) - failure', (done) => {
    request(app.getHttpServer())
      .get(`/review/by/product/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
        done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - failure', () => {
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: HttpStatus.NOT_FOUND,
        message: REVIEW_NOT_FOUND,
        error: 'Not Found',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
