import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { ProjectsResolver } from './projects.resolver.js';

@Module({
  providers: [ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}
