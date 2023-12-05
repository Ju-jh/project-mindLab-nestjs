import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';

@Resolver()
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation(() => Survey)
  async createSurvey(): Promise<Survey> {
    const createdSurvey = await this.surveyService.createSurvey(
      '7aecc6ce-c746-4609-b48c-5b9df148cabe',
    );
    return createdSurvey;
  }

  @Query(() => [Survey])
  async getMySurvey(): Promise<Survey[]> {
    const mySurveys = await this.surveyService.getMySurvey();
    return mySurveys;
  }
}
