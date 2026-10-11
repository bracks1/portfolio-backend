import { Query, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service.js';
import { Project } from './models/project.model.js';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { name: 'projects', description: 'Get all portfolio projects' })
  async getProjects(): Promise<Project[]> {
    return this.projectsService.findAll();
  }
}
