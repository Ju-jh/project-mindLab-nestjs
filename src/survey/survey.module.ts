import { Module } from '@nestjs/common';
import { SurveyResolver } from './survey.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey]), UserModule],
  providers: [SurveyResolver, SurveyService, UserService],
  exports: [TypeOrmModule],
})
export class SurveyModule {}
