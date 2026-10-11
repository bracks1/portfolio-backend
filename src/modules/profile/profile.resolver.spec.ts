import { Test, TestingModule } from '@nestjs/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProfileResolver } from './profile.resolver.js';
import { ProfileService } from './profile.service.js';
import { DataloaderService } from '../../common/dataloader/dataloader.service.js';
import { Profile } from './models/profile.model.js';

describe('ProfileResolver', () => {
  let resolver: ProfileResolver;
  let profileService: ProfileService;
  let dataloader: DataloaderService;

  const mockProfile: Profile = {
    id: 'profile-uuid-1',
    name: 'Alisevich Stanislau',
    title: 'Full-Stack & Backend Engineer',
    description: 'Specialist bio',
    email: 'alisevics558@gmail.com',
    location: 'Remote',
    links: [],
    skills: [],
    experience: [],
    projects: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockProfileService = {
      getProfile: vi.fn().mockResolvedValue(mockProfile),
    };

    const mockDataloaderService = {
      skillsByProfileId: { load: vi.fn().mockResolvedValue([{ id: 's1', name: 'TypeScript', category: 'Languages' }]) },
      experienceByProfileId: {
        load: vi.fn().mockResolvedValue([
          {
            id: 'e1',
            company: 'Independent Consulting',
            position: 'Lead Engineer',
            period: '2022 — Present',
            achievements: ['Achievement 1'],
          },
        ]),
      },
      projectsByProfileId: {
        load: vi.fn().mockResolvedValue([
          {
            id: 'p1',
            name: 'Digital Business Card',
            description: 'API description',
            url: 'https://github.com/bracks1/portfolio-backend',
            technologies: ['NestJS', 'TypeScript'],
          },
        ]),
      },
      linksByProfileId: {
        load: vi.fn().mockResolvedValue([{ id: 'l1', platform: 'GitHub', url: 'https://github.com/bracks1' }]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileResolver,
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
        {
          provide: DataloaderService,
          useValue: mockDataloaderService,
        },
      ],
    }).compile();

    resolver = module.get<ProfileResolver>(ProfileResolver);
    profileService = module.get<ProfileService>(ProfileService);
    dataloader = module.get<DataloaderService>(DataloaderService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return profile', async () => {
    const result = await resolver.getProfile();
    expect(result).toEqual(mockProfile);
    expect(profileService.getProfile).toHaveBeenCalled();
  });

  it('should resolve skills via dataloader', async () => {
    const skills = await resolver.getSkills(mockProfile);
    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('TypeScript');
    expect(dataloader.skillsByProfileId.load).toHaveBeenCalledWith(mockProfile.id);
  });

  it('should resolve experience via dataloader', async () => {
    const experience = await resolver.getExperience(mockProfile);
    expect(experience).toHaveLength(1);
    expect(experience[0].company).toBe('Independent Consulting');
    expect(dataloader.experienceByProfileId.load).toHaveBeenCalledWith(mockProfile.id);
  });

  it('should resolve projects via dataloader', async () => {
    const projects = await resolver.getProjects(mockProfile);
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('Digital Business Card');
    expect(dataloader.projectsByProfileId.load).toHaveBeenCalledWith(mockProfile.id);
  });

  it('should resolve links via dataloader', async () => {
    const links = await resolver.getLinks(mockProfile);
    expect(links).toHaveLength(1);
    expect(links[0].platform).toBe('GitHub');
    expect(dataloader.linksByProfileId.load).toHaveBeenCalledWith(mockProfile.id);
  });
});
