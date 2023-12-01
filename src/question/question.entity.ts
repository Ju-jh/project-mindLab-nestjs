import { Answer } from 'src/answer/answer.entity';
import { Option } from 'src/option/option.entity';
import { Survey } from 'src/survey/survey.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => Survey, (survey) => survey.questions)
  survey: Survey;

  @OneToMany(() => Option, (option) => option.question)
  options: Option[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
