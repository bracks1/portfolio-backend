import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('GraphQL API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Portfolio Profile and Nested Queries', () => {
    it('should successfully execute the assignment specification query', async () => {
      const assignmentQuery = `
        query {
          profile {
            name
            description
            skills {
              name
            }
            experience {
              company
              position
            }
            projects {
              name
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: assignmentQuery })
        .expect(200);

      expect(response.body.errors).toBeUndefined();
      const profile = response.body.data.profile;

      expect(profile).toBeDefined();
      expect(profile.name).toBe('Alisevich Stanislau');
      expect(profile.description).toContain('Full-stack');

      expect(Array.isArray(profile.skills)).toBe(true);
      expect(profile.skills.length).toBeGreaterThan(0);
      expect(profile.skills[0]).toHaveProperty('name');

      expect(Array.isArray(profile.experience)).toBe(true);
      expect(profile.experience.length).toBeGreaterThan(0);
      expect(profile.experience[0]).toHaveProperty('company');
      expect(profile.experience[0]).toHaveProperty('position');

      expect(Array.isArray(profile.projects)).toBe(true);
      expect(profile.projects.length).toBeGreaterThan(0);
      expect(profile.projects[0]).toHaveProperty('name');
    });

    it('should return complete nested profile data with links, achievements and technologies', async () => {
      const fullProfileQuery = `
        query {
          profile {
            id
            name
            title
            description
            email
            links {
              platform
              url
            }
            skills {
              id
              name
              category
            }
            experience {
              id
              company
              position
              period
              achievements
            }
            projects {
              id
              name
              description
              url
              technologies
            }
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: fullProfileQuery })
        .expect(200);

      expect(response.body.errors).toBeUndefined();
      const profile = response.body.data.profile;

      // Check Links
      expect(profile.links).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ platform: 'GitHub', url: 'https://github.com/bracks1' }),
        ]),
      );

      // Check Experience achievements
      expect(profile.experience[0].achievements.length).toBeGreaterThan(0);
      expect(typeof profile.experience[0].achievements[0]).toBe('string');

      // Check Project technologies
      expect(profile.projects[0].technologies.length).toBeGreaterThan(0);
      expect(typeof profile.projects[0].technologies[0]).toBe('string');
    });
  });

  describe('Standalone Queries', () => {
    it('should query skills and support category filtering', async () => {
      const skillsQuery = `
        query {
          allSkills: skills {
            name
            category
          }
          devopsSkills: skills(category: "DevOps & Infrastructure") {
            name
            category
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: skillsQuery })
        .expect(200);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.allSkills.length).toBeGreaterThan(0);
      expect(response.body.data.devopsSkills.length).toBeGreaterThan(0);
      expect(response.body.data.devopsSkills[0].category).toBe('DevOps & Infrastructure');
    });

    it('should query experience history directly', async () => {
      const experienceQuery = `
        query {
          experience {
            company
            position
            period
            achievements
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: experienceQuery })
        .expect(200);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.experience.length).toBeGreaterThan(0);
    });

    it('should query projects directly', async () => {
      const projectsQuery = `
        query {
          projects {
            name
            description
            url
            technologies
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: projectsQuery })
        .expect(200);

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.projects.length).toBeGreaterThan(0);
    });
  });
});
