import { forwardRef } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { faker } from '@faker-js/faker';
import { CreateUsersInput } from './interface/dto/create-users.input';
import { ProjectsModule } from '../projects/projects.module';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { AppModule } from '../app.module';
import { omit } from 'lodash';
import { User } from '@prisma/client';

// const mockUserService = {
//   createUser: jest.fn(),
//   findAllUsers: jest.fn(),
// };

describe('UsersResolver', () => {
  let userResolver: UsersResolver;
  let userResult: Omit<User, 'password'>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        forwardRef(() => ProjectsModule),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider()),
      ],
      providers: [UsersResolver, UsersService, BcryptService],
      exports: [UsersService],
    }).compile();

    userResolver = module.get<UsersResolver>(UsersResolver);
  });

  afterAll(async () => {
    // TODO: delete fake user from DB.
  });

  it('should be defined', () => {
    expect(userResolver).toBeDefined();
  });

  it('should be create user', async () => {
    const fakeName = faker.person.firstName();
    const fakeEmail = faker.internet.email();
    const fakeUserName = faker.string.alphanumeric(20);
    const fakeBio = faker.person.bio();
    const fakePassword = faker.string.alphanumeric();

    const createUsersInput: CreateUsersInput = {
      name: fakeName,
      email: fakeEmail,
      username: fakeUserName,
      password: fakePassword,
      bio: fakeBio,
    };

    userResult = await userResolver.createUser(createUsersInput);

    expect(omit(userResult, 'id')).toEqual({
      name: fakeName,
      email: fakeEmail,
      username: fakeUserName,
      bio: fakeBio,
    });
    expect(userResult.id).toBeDefined();
  });
});
