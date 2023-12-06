import { Module } from '@nestjs/common';
import { QuestionResolver } from './question.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { QuestionService } from './question.service';
import { SurveyModule } from 'src/survey/survey.module';
import { Repository } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, Repository]),
    UserModule,
    SurveyModule,
  ],
  providers: [QuestionResolver, UserService, QuestionService],
})
export class QuestionModule {}
