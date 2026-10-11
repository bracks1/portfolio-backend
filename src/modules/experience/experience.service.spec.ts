import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExperienceService } from './experience.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('ExperienceService', () => {
  let service: ExperienceService;
  let prisma: PrismaService;

  const mockDbExperience = [
    {
      id: 'e1',
      company: 'Independent Software Engineering',
      position: 'Lead Full-Stack / Backend Engineer',
      period: '2022 — Present',
      startDate: '2022-01',
      endDate: 'Present',
      profileId: 'p1',
      createdAt: new Date(),
      achievements: [{ id: 'a1', text: 'Full SDLC delivery', experienceId: 'e1' }],
    },
  ];

  beforeEach(async () => {
    const mockPrisma = {
      experience: {
        findMany: vi.fn().mockResolvedValue(mockDbExperience),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return mapped experiences with string achievements', async () => {
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(result[0].company).toBe('Independent Software Engineering');
    expect(result[0].achievements).toEqual(['Full SDLC delivery']);
    expect(prisma.experience.findMany).toHaveBeenCalledWith({
      include: { achievements: true },
      orderBy: { createdAt: 'asc' },
    });
  });

  it('should find experience by profileId', async () => {
    const result = await service.findByProfileId('p1');
    expect(result).toHaveLength(1);
    expect(prisma.experience.findMany).toHaveBeenCalledWith({
      where: { profileId: 'p1' },
      include: { achievements: true },
      orderBy: { createdAt: 'asc' },
    });
  });
});
