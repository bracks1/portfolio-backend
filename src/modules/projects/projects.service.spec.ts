import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectsService } from './projects.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: PrismaService;

  const mockDbProject = [
    {
      id: 'proj1',
      name: 'Digital Business Card Backend API',
      description: 'NestJS and GraphQL portfolio API',
      url: 'https://github.com/bracks1/portfolio-backend',
      repoUrl: 'https://github.com/bracks1/portfolio-backend',
      liveUrl: 'https://portfolio-backend.vercel.app',
      profileId: 'p1',
      createdAt: new Date(),
      technologies: [{ id: 't1', name: 'NestJS', projectId: 'proj1' }],
    },
  ];

  beforeEach(async () => {
    const mockPrisma = {
      project: {
        findMany: vi.fn().mockResolvedValue(mockDbProject),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return mapped projects with technologies array', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Digital Business Card Backend API');
    expect(result[0].technologies).toEqual(['NestJS']);
    expect(prisma.project.findMany).toHaveBeenCalledWith({
      include: { technologies: true },
      orderBy: { createdAt: 'asc' },
    });
  });

  it('should find projects by profileId', async () => {
    const result = await service.findByProfileId('p1');
    expect(result).toHaveLength(1);
    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { profileId: 'p1' },
      include: { technologies: true },
      orderBy: { createdAt: 'asc' },
    });
  });
});
