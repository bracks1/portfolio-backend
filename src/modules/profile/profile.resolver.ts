import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ProfileService } from './profile.service.js';
import { Profile } from './models/profile.model.js';
import { SocialLink } from './models/social-link.model.js';
import { Skill } from '../skills/models/skill.model.js';
import { Experience } from '../experience/models/experience.model.js';
import { Project } from '../projects/models/project.model.js';
import { DataloaderService } from '../../common/dataloader/dataloader.service.js';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly dataloader: DataloaderService,
  ) {}

  @Query(() => Profile, {
    name: 'profile',
    nullable: true,
    description: 'Get digital business card profile with all related information',
  })
  async getProfile(): Promise<Profile | null> {
    return this.profileService.getProfile();
  }

  @ResolveField(() => [SocialLink], { name: 'links', description: 'Professional social and contact links' })
  async getLinks(@Parent() profile: Profile): Promise<SocialLink[]> {
    return this.dataloader.linksByProfileId.load(profile.id);
  }

  @ResolveField(() => [Skill], { name: 'skills', description: 'Technical skills list' })
  async getSkills(@Parent() profile: Profile): Promise<Skill[]> {
    return this.dataloader.skillsByProfileId.load(profile.id);
  }

  @ResolveField(() => [Experience], { name: 'experience', description: 'Work experience history' })
  async getExperience(@Parent() profile: Profile): Promise<Experience[]> {
    return this.dataloader.experienceByProfileId.load(profile.id);
  }

  @ResolveField(() => [Project], { name: 'projects', description: 'Portfolio projects' })
  async getProjects(@Parent() profile: Profile): Promise<Project[]> {
    return this.dataloader.projectsByProfileId.load(profile.id);
  }
}
