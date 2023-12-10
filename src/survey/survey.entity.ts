import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Answer } from 'src/answer/answer.entity';
import { Question } from 'src/question/question.entity';
import { User } from 'src/user/user.entity';
import { Option } from 'src/option/option.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';

@Entity('survey')
@ObjectType()
export class Survey {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  s_id: string;

  @Field(() => String)
  @Column({ default: '무제' })
  title: string;

  @Field(() => String)
  @Column({ default: '' })
  description: string;

  @Field(() => Boolean)
  @Column({ default: false })
  public: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.surveys)
  user: User;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.survey, { cascade: true })
  questions: Question[];

  @Field(() => [Answer])
  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @Field(() => [Option])
  @ManyToMany(() => Option, { cascade: true })
  @JoinTable()
  options: Option[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
