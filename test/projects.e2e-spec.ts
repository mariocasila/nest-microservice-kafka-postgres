import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { faker } from '@faker-js/faker';
import { UserType } from '../src/shared/users/gql/user.type';
import { ProjectsService } from '../src/projects/projects.service';

import { forwardRef } from '@nestjs/common';
import { ProjectsResolver } from '../src/projects/projects.resolver';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersModule } from '../src/users/users.module';

describe('Projects GraphQL (e2e)', () => {
  let app: INestApplication;
  let userService: UsersService;
  let projectService: ProjectsService;
  let user: Omit<UserType, 'password'>;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, forwardRef(() => UsersModule)],
      providers: [ProjectsService, ProjectsResolver, PrismaService],
      exports: [ProjectsService],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get<UsersService>(UsersService);
    projectService = app.get<ProjectsService>(ProjectsService);
    await app.init();

    const fakeName = faker.person.firstName();
    const fakeEmail = faker.internet.email();
    const fakeUserName = faker.string.alphanumeric();
    const fakeBio = faker.person.bio();
    const fakePassword = faker.string.alphanumeric();

    user = await userService.createUser({
      name: fakeName,
      email: fakeEmail,
      username: fakeUserName,
      password: fakePassword,
      bio: fakeBio,
    });

    const userInfo = await userService.generateTokens(user);
    expect(userInfo).toBeDefined();
    expect(userInfo.accessToken).toBeDefined();

    accessToken = userInfo.accessToken;
  });

  afterAll(async () => {
    await projectService.deleteProjectByUserId(user.id);
    await userService.deleteUser(user.id);
    await app.close();
  });

  it('should create a new project', async () => {
    const projectTitle = faker.lorem.sentence();
    const createProjectMutation = `
      mutation createProject($createProjectsInput:CreateProjectsInput!) {
        createProject(createProjectsInput: $createProjectsInput) {
          id
          title
          userId
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: createProjectMutation,
        variables: {
          createProjectsInput: {
            title: projectTitle,
            userId: user.id,
          },
        },
      })
      .expect(200);

    expect(response.body.data.createProject).toEqual({
      id: expect.any(Number), // You may want a more specific check here
      title: projectTitle,
      userId: user.id,
    });
  });
});
