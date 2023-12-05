import { Resolver, Mutation } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';

@Resolver()
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation(() => Survey)
  async createSurvey(): Promise<Survey> {
    const createdSurvey = await this.surveyService.createSurvey();
    return createdSurvey;
  }
}
