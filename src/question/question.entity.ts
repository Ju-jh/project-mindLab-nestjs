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
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  q_id: string;

  @Field()
  @Column({ default: '제목을 입력하세요' })
  text: string;

  @Field(() => Survey)
  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @Field(() => [Option])
  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @Field(() => Answer)
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
