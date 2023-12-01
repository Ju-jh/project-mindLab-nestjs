import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Book {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  author: string;
}
