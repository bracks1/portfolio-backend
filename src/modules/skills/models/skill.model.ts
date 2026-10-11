import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Technical skill or professional competency' })
export class Skill {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Skill or technology name' })
  name: string;

  @Field(() => String, { description: 'Category (e.g. Backend, Databases, DevOps)' })
  category: string;
}
