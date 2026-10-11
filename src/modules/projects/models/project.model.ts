import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Portfolio project or software development work' })
export class Project {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Project name' })
  name: string;

  @Field(() => String, { description: 'Detailed project description' })
  description: string;

  @Field(() => String, { description: 'Link to project or repository' })
  url: string;

  @Field(() => String, { nullable: true, description: 'Source code repository link' })
  repoUrl?: string;

  @Field(() => String, { nullable: true, description: 'Live demonstration or production URL' })
  liveUrl?: string;

  @Field(() => [String], { description: 'Technologies and tools used' })
  technologies: string[];
}
