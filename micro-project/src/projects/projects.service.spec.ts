import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';

import { forwardRef } from '@nestjs/common';
import { ProjectsResolver } from './projects.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectsService, ProjectsResolver],
      exports: [ProjectsService],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: More test cases coming, please check uesrs.service.spec.ts to refer.
});
