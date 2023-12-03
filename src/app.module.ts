import { Module } from '@nestjs/common';
import { QuestionModule } from './question/question.module';
import { OptionModule } from './option/option.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AnswerModule } from './answer/answer.module';
import * as dotenv from 'dotenv';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { SurveyModule } from './survey/survey.module';
import { Client } from 'pg';

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
      extra: {
        ssl: false,
      },
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
})
export class AppModule {
  constructor() {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    client.connect();

    client.query(
      'SELECT table_schema,table_name FROM information_schema.tables;',
      (err, res) => {
        if (err) throw err;
        for (const row of res.rows) {
          console.log(JSON.stringify(row));
        }
        client.end();
      },
    );
  }
}
