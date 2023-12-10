import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { Option } from 'src/option/option.entity';
import { Survey } from 'src/survey/survey.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('question')
@ObjectType()
export class Question {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  q_id: string;

  @Field(() => String)
  @Column({ default: '' })
  text: string;

  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @Field(() => [Option], { nullable: true })
  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @Field(() => [Answer], { nullable: true })
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
