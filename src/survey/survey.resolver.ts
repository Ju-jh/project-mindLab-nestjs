import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyInput } from './survey.input';
import { SurveyService } from './survey.service';

@Resolver()
export class SurveyResolver {
  constructor(private readonly surveyService: SurveyService) {}

  @Mutation(() => Survey)
  async createSurvey(@Args() input: SurveyInput): Promise<Survey> {
    const createdSurvey = await this.surveyService.createSurvey(input);
    return createdSurvey;
  }
}
