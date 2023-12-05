import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { Survey } from 'src/survey/survey.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  u_id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  photo: string;

  @Field(() => [Survey], { nullable: true })
  @OneToMany(() => Survey, (survey) => survey.user, { nullable: true })
  surveys: Survey[];

  @Field(() => [Answer], { nullable: true })
  @OneToMany(() => Answer, (answer) => answer.user, { nullable: true })
  answers: Answer[];
}
