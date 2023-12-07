import { Module } from '@nestjs/common';
import { QuestionResolver } from './question.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { QuestionService } from './question.service';
import { SurveyModule } from 'src/survey/survey.module';
import { Repository } from 'typeorm';
import { Option } from 'src/option/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Option, Repository]),
    UserModule,
    SurveyModule,
  ],
  providers: [QuestionResolver, UserService, QuestionService],
  exports: [TypeOrmModule],
})
export class QuestionModule {}
