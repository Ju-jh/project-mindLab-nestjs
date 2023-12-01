import { Answer } from 'src/answer/answer.entity';
import { Survey } from 'src/survey/survey.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @OneToMany(() => Survey, (survey) => survey.user)
  surveys: Survey[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
