import { Answer } from 'src/answer/answer.entity';
import { Question } from 'src/question/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column()
  score: number;

  @ManyToOne(() => Question, (question) => question.options)
  question: Question;

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
