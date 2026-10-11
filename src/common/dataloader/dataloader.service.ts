import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { PrismaService } from '../../database/prisma.service.js';
import { Skill } from '../../modules/skills/models/skill.model.js';
import { Experience } from '../../modules/experience/models/experience.model.js';
import { Project } from '../../modules/projects/models/project.model.js';
import { SocialLink } from '../../modules/profile/models/social-link.model.js';

@Injectable({ scope: Scope.REQUEST })
export class DataloaderService {
  constructor(private readonly prisma: PrismaService) {}

  public readonly skillsByProfileId = new DataLoader<string, Skill[]>(
    async (profileIds: readonly string[]): Promise<Skill[][]> => {
      const skills = await this.prisma.skill.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { createdAt: 'asc' },
      });
      const map = new Map<string, Skill[]>();
      for (const skill of skills) {
        if (!map.has(skill.profileId)) {
          map.set(skill.profileId, []);
        }
        map.get(skill.profileId)!.push({
          id: skill.id,
          name: skill.name,
          category: skill.category,
        });
      }
      return profileIds.map((id) => map.get(id) || []);
    },
  );

  public readonly experienceByProfileId = new DataLoader<string, Experience[]>(
    async (profileIds: readonly string[]): Promise<Experience[][]> => {
      const experiences = await this.prisma.experience.findMany({
        where: { profileId: { in: [...profileIds] } },
        include: { achievements: true },
        orderBy: { createdAt: 'asc' },
      });
      const map = new Map<string, Experience[]>();
      for (const exp of experiences) {
        if (!map.has(exp.profileId)) {
          map.set(exp.profileId, []);
        }
        map.get(exp.profileId)!.push({
          id: exp.id,
          company: exp.company,
          position: exp.position,
          period: exp.period,
          startDate: exp.startDate ?? undefined,
          endDate: exp.endDate ?? undefined,
          achievements: exp.achievements.map((a) => a.text),
        });
      }
      return profileIds.map((id) => map.get(id) || []);
    },
  );

  public readonly projectsByProfileId = new DataLoader<string, Project[]>(
    async (profileIds: readonly string[]): Promise<Project[][]> => {
      const projects = await this.prisma.project.findMany({
        where: { profileId: { in: [...profileIds] } },
        include: { technologies: true },
        orderBy: { createdAt: 'asc' },
      });
      const map = new Map<string, Project[]>();
      for (const proj of projects) {
        if (!map.has(proj.profileId)) {
          map.set(proj.profileId, []);
        }
        map.get(proj.profileId)!.push({
          id: proj.id,
          name: proj.name,
          description: proj.description,
          url: proj.url,
          repoUrl: proj.repoUrl ?? undefined,
          liveUrl: proj.liveUrl ?? undefined,
          technologies: proj.technologies.map((t) => t.name),
        });
      }
      return profileIds.map((id) => map.get(id) || []);
    },
  );

  public readonly linksByProfileId = new DataLoader<string, SocialLink[]>(
    async (profileIds: readonly string[]): Promise<SocialLink[][]> => {
      const links = await this.prisma.socialLink.findMany({
        where: { profileId: { in: [...profileIds] } },
        orderBy: { createdAt: 'asc' },
      });
      const map = new Map<string, SocialLink[]>();
      for (const link of links) {
        if (!map.has(link.profileId)) {
          map.set(link.profileId, []);
        }
        map.get(link.profileId)!.push({
          id: link.id,
          platform: link.platform,
          url: link.url,
        });
      }
      return profileIds.map((id) => map.get(id) || []);
    },
  );
}
