import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SurveyService {
  private readonly logger = new Logger(SurveyService.name);

  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  private handleQueryError(
    methodName: string,
    id: number,
    error: Error,
  ): never {
    this.logger.error(`Error in ${methodName}: ${error.message}`);
    throw new Error(
      `Failed to fetch ${methodName.toLowerCase()} with id ${id}`,
    );
  }

  async createSurvey(userId: string): Promise<Survey> {
    try {
      const survey = this.surveyRepository.create({ user: { u_id: userId } });
      return await this.surveyRepository.save(survey);
    } catch (error) {
      this.handleQueryError('createSurvey', 0, error);
    }
  }

  async getMySurvey(userId: string): Promise<Survey[]> {
    try {
      const mySurveys = await this.surveyRepository.find({
        where: { user: { u_id: userId } },
      });

      return mySurveys;
    } catch (error) {
      console.error('Error while getting user surveys:', error);
      throw error;
    }
  }
}
