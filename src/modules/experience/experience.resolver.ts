import { Query, Resolver } from '@nestjs/graphql';
import { ExperienceService } from './experience.service.js';
import { Experience } from './models/experience.model.js';

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @Query(() => [Experience], { name: 'experience', description: 'Get professional work experience history' })
  async getExperience(): Promise<Experience[]> {
    return this.experienceService.findAll();
  }
}
