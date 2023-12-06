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
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  o_id: string;

  @Field()
  @Column({ default: '문항 제목을 입력하세요' })
  text: string;

  @Field()
  @Column({ default: 1 })
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
