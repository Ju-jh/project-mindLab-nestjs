import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { Question } from 'src/question/question.entity';
import { Survey } from 'src/survey/survey.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class Option {
  save() {
    throw new Error('Method not implemented.');
  }
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  o_id: string;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  score: number;

  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @Field(() => Answer)
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
