import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { Question } from 'src/question/question.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class Survey {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  s_id: string;

  @Field()
  @Column()
  @Column({ default: '' })
  title: string;

  @Field()
  @Column()
  @Column({ default: '' })
  description: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.surveys)
  user: User;

  @Field(() => Question)
  @OneToMany(() => Question, (question) => question.survey)
  questions: Question[];

  @Field(() => Answer)
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];
}
