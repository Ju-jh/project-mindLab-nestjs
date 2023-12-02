import { Field, Int } from '@nestjs/graphql';
import { Option } from 'src/option/option.entity';
import { Question } from 'src/question/question.entity';
import { Survey } from 'src/survey/survey.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => Int)
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.answers)
  survey: Survey;

  @Field(() => Question)
  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;

  @Field(() => Option)
  @ManyToOne(() => Option, (option) => option.answers)
  option: Option;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
