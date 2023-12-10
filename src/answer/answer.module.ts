import { Module } from '@nestjs/common';
import { AnswerResolver } from './answer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { Repository } from 'typeorm';
import { AnswerService } from './answer.service';
import { SurveyModule } from 'src/survey/survey.module';
import { QuestionModule } from 'src/question/question.module';
import { OptionModule } from 'src/option/option.module';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Repository]),
    UserModule,
    SurveyModule,
    QuestionModule,
    OptionModule,
  ],
  providers: [AnswerResolver, AnswerService, UserService],
  exports: [TypeOrmModule],
})
export class AnswerModule {}
