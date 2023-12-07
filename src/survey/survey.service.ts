import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async getSurveyData(userId: string, surveyId: string): Promise<Survey> {
    try {
      const survey = await this.surveyRepository.findOne({
        where: { s_id: surveyId, user: { u_id: userId } },
        relations: ['questions', 'questions.options'],
      });
      if (!survey) {
        throw new NotFoundException(
          `Survey with id ${surveyId} not found for user ${userId}`,
        );
      }
      return survey;
    } catch (error) {
      this.handleQueryError('getSurveyData', 1, error);
    }
  }

  async updateSurveyTitle(
    userId: string,
    surveyId: string,
    newTitle: string,
  ): Promise<Survey> {
    try {
      const survey = await this.surveyRepository.findOne({
        where: { s_id: surveyId, user: { u_id: userId } },
      });

      if (!survey) {
        throw new NotFoundException(
          `Survey with id ${surveyId} not found for user ${userId}`,
        );
      }
      survey.title = newTitle;
      await this.surveyRepository.save(survey);
      return survey;
    } catch (error) {
      this.handleQueryError('updateSurveyTitle', 2, error);
    }
  }

  async updateSurveyDescription(
    userId: string,
    surveyId: string,
    newDescription: string,
  ): Promise<Survey> {
    try {
      const survey = await this.surveyRepository.findOne({
        where: { s_id: surveyId, user: { u_id: userId } },
      });

      if (!survey) {
        throw new NotFoundException(
          `Survey with id ${surveyId} not found for user ${userId}`,
        );
      }
      survey.description = newDescription;
      await this.surveyRepository.save(survey);
      return survey;
    } catch (error) {
      this.handleQueryError('updateSurveyDescription', 3, error);
    }
  }

  async getMySurvey(userId: string): Promise<Survey[]> {
    try {
      const mySurveys = await this.surveyRepository.find({
        where: { user: { u_id: userId } },
      });
      return mySurveys;
    } catch (error) {
      this.handleQueryError('getMySurvey', 4, error);
    }
  }

  async getAllSurvey(): Promise<Survey[]> {
    try {
      const AllSurveys = await this.surveyRepository.find();
      return AllSurveys;
    } catch (error) {
      this.handleQueryError('getAllSurvey', 4, error);
    }
  }

  async deleteSurvey(
    surveyId: string,
    userId: string,
  ): Promise<{ success: boolean }> {
    try {
      const survey = await this.surveyRepository.findOne({
        where: { s_id: surveyId, user: { u_id: userId } },
      });

      if (survey) {
        await this.surveyRepository.remove(survey);
        return { success: true };
      } else {
        throw new Error(
          '설문지를 찾을 수 없거나 삭제할 수 있는 권한이 없습니다.',
        );
      }
    } catch (error) {
      this.handleQueryError('deleteSurvey', 5, error);
    }
  }

  async findSurveyByIdAndUserId(
    surveyId: string,
    userId: string,
  ): Promise<Survey> {
    return this.surveyRepository.findOne({
      where: { s_id: surveyId, user: { u_id: userId } },
    });
  }

  async saveSurvey(survey: Survey): Promise<Survey> {
    return this.surveyRepository.save(survey);
  }
}
