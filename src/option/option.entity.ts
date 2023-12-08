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
  CreateDateColumn,
} from 'typeorm';

@Entity('option')
@ObjectType()
export class Option {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  o_id: string;

  @Field()
  @Column({ default: '' })
  text: string;

  @Field()
  @Column({ default: 0 })
  score: number;

  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @Field(() => [Answer], { nullable: true })
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
