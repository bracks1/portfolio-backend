import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SkillsService } from './skills.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('SkillsService', () => {
  let service: SkillsService;
  let prisma: PrismaService;

  const mockSkills = [
    { id: '1', name: 'TypeScript', category: 'Languages', profileId: 'p1', createdAt: new Date() },
    { id: '2', name: 'NestJS', category: 'Backend Frameworks', profileId: 'p1', createdAt: new Date() },
  ];

  beforeEach(async () => {
    const mockPrisma = {
      skill: {
        findMany: vi.fn().mockResolvedValue(mockSkills),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all skills', async () => {
    const skills = await service.findAll();
    expect(skills).toEqual(mockSkills);
    expect(prisma.skill.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  });

  it('should filter skills by category', async () => {
    await service.findAll('Languages');
    expect(prisma.skill.findMany).toHaveBeenCalledWith({
      where: { category: 'Languages' },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  });

  it('should find skills by profileId', async () => {
    await service.findByProfileId('p1');
    expect(prisma.skill.findMany).toHaveBeenCalledWith({
      where: { profileId: 'p1' },
      orderBy: { createdAt: 'asc' },
    });
  });
});
