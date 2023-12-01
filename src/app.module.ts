import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { SurveyController } from './survey/survey.controller';
import { SurveyService } from './survey/survey.service';
import { SurveyModule } from './survey/survey.module';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';
import { OptionController } from './option/option.controller';
import { OptionService } from './option/option.service';
import { OptionModule } from './option/option.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AnswerController } from './answer/answer.controller';
import { AnswerService } from './answer/answer.service';
import { AnswerModule } from './answer/answer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, // PostgreSQL 포트 번호
      username: 'jayden',
      password: 'jj1020',
      database: 'mindlab', // 생성한 데이터베이스 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 개발 환경에서는 true로 설정 (자동으로 데이터베이스 동기화)
    }),
    GraphqlModule,
    SurveyModule,
    QuestionModule,
    OptionModule,
    UserModule,
    AnswerModule,
  ],
  controllers: [
    AppController,
    SurveyController,
    QuestionController,
    OptionController,
    UserController,
    AnswerController,
  ],
  providers: [
    AppService,
    SurveyService,
    QuestionService,
    OptionService,
    UserService,
    AnswerService,
  ],
})
export class AppModule {}
