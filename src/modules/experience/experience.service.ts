import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Experience } from './models/experience.model.js';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Experience[]> {
    const list = await this.prisma.experience.findMany({
      include: { achievements: true },
      orderBy: { createdAt: 'asc' },
    });
    return list.map((exp) => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      period: exp.period,
      startDate: exp.startDate ?? undefined,
      endDate: exp.endDate ?? undefined,
      achievements: exp.achievements.map((a) => a.text),
    }));
  }

  async findByProfileId(profileId: string): Promise<Experience[]> {
    const list = await this.prisma.experience.findMany({
      where: { profileId },
      include: { achievements: true },
      orderBy: { createdAt: 'asc' },
    });
    return list.map((exp) => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      period: exp.period,
      startDate: exp.startDate ?? undefined,
      endDate: exp.endDate ?? undefined,
      achievements: exp.achievements.map((a) => a.text),
    }));
  }
}
