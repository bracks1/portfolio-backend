import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Professional work experience and role details' })
export class Experience {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Company or organization name' })
  company: string;

  @Field(() => String, { description: 'Job position or role' })
  position: string;

  @Field(() => String, { description: 'Employment period (e.g. 2022 — Present)' })
  period: string;

  @Field(() => String, { nullable: true, description: 'Start date in YYYY-MM format' })
  startDate?: string;

  @Field(() => String, { nullable: true, description: 'End date in YYYY-MM format or Present' })
  endDate?: string;

  @Field(() => [String], { description: 'List of key achievements and contributions' })
  achievements: string[];
}
