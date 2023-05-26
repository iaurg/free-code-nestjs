import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('SignUp', () => {
      it.todo('should create a new user');
    });
    describe('SignIn', () => {
      it.todo(
        'should return a token and the user info when the credentials are valid',
      );
      it.todo('should return a 401 when the credentials are invalid');
    });
  });
  describe('User', () => {
    describe('Get Me', () => {});
    describe('Edit User', () => {});
  });
  describe('Bookmark', () => {
    describe('Get All Bookmarks', () => {});
    describe('Get One Bookmark by Id', () => {});
    describe('Create Bookmark', () => {});
    describe('Update Bookmark', () => {});
    describe('Delete Bookmark', () => {});
  });
});
