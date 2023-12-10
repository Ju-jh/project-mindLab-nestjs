import { Module } from '@nestjs/common';
import { SurveyResolver } from './survey.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Answer } from 'src/answer/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Survey, Answer, Repository]), UserModule],
  providers: [SurveyResolver, SurveyService, UserService],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
