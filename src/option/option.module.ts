import { Module } from '@nestjs/common';
import { OptionResolver } from './option.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './option.entity';
import { Repository } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { SurveyModule } from 'src/survey/survey.module';
import { UserService } from 'src/user/user.service';
import { QuestionModule } from 'src/question/question.module';
import { OptionService } from './option.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Option, Repository]),
    UserModule,
    SurveyModule,
    QuestionModule,
  ],
  providers: [OptionResolver, UserService, OptionService],
})
export class OptionModule {}
