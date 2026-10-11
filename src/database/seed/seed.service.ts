import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { defaultPortfolioData, InitialPortfolioData } from './seed.data.js';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedIfNeeded();
  }

  async seedIfNeeded(): Promise<boolean> {
    try {
      const existingCount = await this.prisma.profile.count();
      if (existingCount === 0) {
        this.logger.log('Database has no profile record. Initializing automatic database seeding...');
        await this.seed(defaultPortfolioData);
        this.logger.log('Database successfully initialized and seeded with portfolio data.');
        return true;
      }
      this.logger.log(`Database already contains profile data (${existingCount} profile(s)). Skipping seed.`);
      return false;
    } catch (error) {
      this.logger.warn(
        `Unable to perform initial database check/seed. Ensure database migrations are applied. Error: ${error instanceof Error ? error.message : error}`,
      );
      return false;
    }
  }

  async seed(data: InitialPortfolioData = defaultPortfolioData) {
    return this.prisma.$transaction(async (tx) => {
      // Create Profile
      const profile = await tx.profile.create({
        data: {
          name: data.profile.name,
          title: data.profile.title,
          description: data.profile.description,
          email: data.profile.email,
          location: data.profile.location,
        },
      });

      // Create Social Links
      if (data.links?.length) {
        await tx.socialLink.createMany({
          data: data.links.map((link) => ({
            platform: link.platform,
            url: link.url,
            profileId: profile.id,
          })),
        });
      }

      // Create Skills
      if (data.skills?.length) {
        await tx.skill.createMany({
          data: data.skills.map((skill) => ({
            name: skill.name,
            category: skill.category,
            profileId: profile.id,
          })),
        });
      }

      // Create Experience with Achievements
      if (data.experience?.length) {
        for (const exp of data.experience) {
          const createdExp = await tx.experience.create({
            data: {
              company: exp.company,
              position: exp.position,
              period: exp.period,
              startDate: exp.startDate,
              endDate: exp.endDate,
              profileId: profile.id,
            },
          });

          if (exp.achievements?.length) {
            await tx.achievement.createMany({
              data: exp.achievements.map((text) => ({
                text,
                experienceId: createdExp.id,
              })),
            });
          }
        }
      }

      // Create Projects with Technologies
      if (data.projects?.length) {
        for (const proj of data.projects) {
          const createdProj = await tx.project.create({
            data: {
              name: proj.name,
              description: proj.description,
              url: proj.url,
              repoUrl: proj.repoUrl,
              liveUrl: proj.liveUrl,
              profileId: profile.id,
            },
          });

          if (proj.technologies?.length) {
            await tx.projectTechnology.createMany({
              data: proj.technologies.map((name) => ({
                name,
                projectId: createdProj.id,
              })),
            });
          }
        }
      }

      return profile;
    });
  }
}
