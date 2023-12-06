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
  AfterInsert,
  getRepository,
} from 'typeorm';

@Entity()
@ObjectType()
export class Option {
  async save() {
    const optionRepository = getRepository(Option);
    await optionRepository.save(this);
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

  @AfterInsert()
  async createDefaultOption() {
    const defaultOption = new Option();
    defaultOption.text = this.text;
    defaultOption.score = this.score;
    defaultOption.survey = this.survey;
    defaultOption.question = this.question;
    await defaultOption.save();
  }
}
