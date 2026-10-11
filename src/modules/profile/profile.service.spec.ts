import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProfileService } from './profile.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockProfile = {
    id: 'test-profile-id',
    name: 'Alisevich Stanislau',
    title: 'Full-Stack & Backend Engineer',
    description: 'Expertise in NestJS, TypeScript, Python',
    email: 'alisevics558@gmail.com',
    location: 'Remote',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      profile: {
        findFirst: vi.fn().mockResolvedValue(mockProfile),
        findUnique: vi.fn().mockResolvedValue(mockProfile),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return profile', async () => {
    const result = await service.getProfile();
    expect(result).toEqual(mockProfile);
    expect(prisma.profile.findFirst).toHaveBeenCalledWith({
      orderBy: { createdAt: 'asc' },
    });
  });

  it('should return profile by id', async () => {
    const result = await service.getProfileById('test-profile-id');
    expect(result).toEqual(mockProfile);
    expect(prisma.profile.findUnique).toHaveBeenCalledWith({
      where: { id: 'test-profile-id' },
    });
  });
});
