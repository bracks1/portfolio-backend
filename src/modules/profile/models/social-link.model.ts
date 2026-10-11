import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Professional links and social resources (GitHub, LinkedIn, etc.)' })
export class SocialLink {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Platform or service name (e.g., GitHub, LinkedIn, Telegram)' })
  platform: string;

  @Field(() => String, { description: 'Direct URL to profile or resource' })
  url: string;
}
