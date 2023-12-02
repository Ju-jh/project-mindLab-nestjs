import { Module } from '@nestjs/common';
import { QuestionService } from './question/question.service';
import { QuestionModule } from './question/question.module';
import { OptionService } from './option/option.service';
import { OptionModule } from './option/option.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AnswerService } from './answer/answer.service';
import { AnswerModule } from './answer/answer.module';
import * as dotenv from 'dotenv';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { SurveyModule } from './survey/survey.module';
import { SurveyService } from './survey/survey.service';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
    }),
    SurveyModule,
    QuestionModule,
    OptionModule,
    UserModule,
    AnswerModule,
  ],
  providers: [
    SurveyService,
    QuestionService,
    OptionService,
    UserService,
    AnswerService,
  ],
})
export class AppModule {}
