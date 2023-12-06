import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { Survey } from 'src/survey/survey.entity';
@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
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

  async createQuestion(userId: string, surveyId: string): Promise<Question> {
    try {
      const survey = await this.surveyRepository.findOne({
        where: { s_id: surveyId },
        relations: ['user'],
      });

      if (!survey || survey.user.u_id !== userId) {
        throw new Error('해당 survey를 생성한 user의 userId와 다릅니다.');
      }

      const question = this.questionRepository.create({
        survey: survey,
      });

      return await this.questionRepository.save(question);
    } catch (error) {
      this.handleQueryError('createQuestion', 0, error);
      throw error;
    }
  }

  async getAllQuestions(userId: string, surveyId: string): Promise<Question[]> {
    try {
      return await this.questionRepository
        .createQueryBuilder('question')
        .innerJoinAndSelect('question.survey', 'survey')
        .innerJoinAndSelect('survey.user', 'user')
        .where('user.u_id = :userId', { userId })
        .andWhere('survey.s_id = :surveyId', { surveyId })
        .getMany();
    } catch (error) {
      this.handleQueryError('getAllQuestions', 0, error);
      throw error;
    }
  }
}
