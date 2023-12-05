import { Module } from '@nestjs/common';
import { SurveyResolver } from './survey.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  providers: [SurveyResolver, SurveyService],
})
export class SurveyModule {}
