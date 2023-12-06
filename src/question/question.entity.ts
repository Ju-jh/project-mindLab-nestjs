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
  AfterInsert,
} from 'typeorm';

@Entity()
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

  @Field(() => Answer)
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
  options: any;

  @AfterInsert()
  async createDefaultOption() {
    const defaultOption = new Option();
    defaultOption.text = 'Default Option';
    defaultOption.score = 0;
    defaultOption.survey = this.survey;
    defaultOption.question = this;
    await defaultOption.save();
  }
}
