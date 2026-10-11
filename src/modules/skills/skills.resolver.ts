import { Args, Query, Resolver } from '@nestjs/graphql';
import { SkillsService } from './skills.service.js';
import { Skill } from './models/skill.model.js';

@Resolver(() => Skill)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @Query(() => [Skill], { name: 'skills', description: 'Get all skills, optionally filtered by category' })
  async getSkills(
    @Args('category', { type: () => String, nullable: true }) category?: string,
  ): Promise<Skill[]> {
    return this.skillsService.findAll(category);
  }
}
