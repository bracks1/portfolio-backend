import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Project } from './models/project.model.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Project[]> {
    const list = await this.prisma.project.findMany({
      include: { technologies: true },
      orderBy: { createdAt: 'asc' },
    });
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      url: p.url,
      repoUrl: p.repoUrl ?? undefined,
      liveUrl: p.liveUrl ?? undefined,
      technologies: p.technologies.map((t) => t.name),
    }));
  }

  async findByProfileId(profileId: string): Promise<Project[]> {
    const list = await this.prisma.project.findMany({
      where: { profileId },
      include: { technologies: true },
      orderBy: { createdAt: 'asc' },
    });
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      url: p.url,
      repoUrl: p.repoUrl ?? undefined,
      liveUrl: p.liveUrl ?? undefined,
      technologies: p.technologies.map((t) => t.name),
    }));
  }
}
