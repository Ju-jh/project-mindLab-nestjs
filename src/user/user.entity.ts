import { Field, Int } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { Survey } from 'src/survey/survey.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  email: string;

  @Field(() => Survey)
  @OneToMany(() => Survey, (survey) => survey.user)
  surveys: Survey[];

  @Field(() => Answer)
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
