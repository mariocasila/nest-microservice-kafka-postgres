import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { faker } from '@faker-js/faker';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { UsersResolver } from './users.resolver';
import { ProjectsModule } from '../projects/projects.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { forwardRef } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UserType } from './interface/gql/user.type';

describe('UsersService', () => {
  let userService: UsersService;
  let fakeUser: Omit<UserType, 'password'>;
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

    userService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await userService.deleteUser(fakeUser.id);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should create new user', async () => {
    const fakeName = faker.person.firstName();
    const fakeEmail = faker.internet.email();
    const fakeUserName = faker.string.numeric({ length: { min: 5, max: 10 } });
    const fakeBio = faker.person.bio();
    const fakePassword = faker.string.alphanumeric();

    fakeUser = await userService.createUser({
      name: fakeName,
      email: fakeEmail,
      username: fakeUserName,
      password: fakePassword,
      bio: fakeBio,
    });
    expect(fakeUser).toBeDefined();
    expect(fakeUser.name).toEqual(fakeName);
    expect(fakeUser.email).toEqual(fakeEmail);
    expect(fakeUser.username).toEqual(fakeUserName);
    expect(fakeUser.bio).toEqual(fakeUser.bio);
  });
});
