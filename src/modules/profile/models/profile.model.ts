import { Field, ID, ObjectType } from '@nestjs/graphql';
import { SocialLink } from './social-link.model.js';
import { Skill } from '../../skills/models/skill.model.js';
import { Experience } from '../../experience/models/experience.model.js';
import { Project } from '../../projects/models/project.model.js';

@ObjectType({ description: 'Specialist digital business card / developer profile' })
export class Profile {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Full name' })
  name: string;

  @Field(() => String, { nullable: true, description: 'Professional headline / job title' })
  title?: string;

  @Field(() => String, { description: 'Short bio and summary of expertise' })
  description: string;

  @Field(() => String, { nullable: true, description: 'Direct contact email' })
  email?: string;

  @Field(() => String, { nullable: true, description: 'Location / Work preference' })
  location?: string;

  @Field(() => [SocialLink], { description: 'Links to GitHub, LinkedIn, Telegram, etc.' })
  links: SocialLink[];

  @Field(() => [Skill], { description: 'List of technical skills and competencies' })
  skills: Skill[];

  @Field(() => [Experience], { description: 'Work history and key achievements' })
  experience: Experience[];

  @Field(() => [Project], { description: 'Featured portfolio projects' })
  projects: Project[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
