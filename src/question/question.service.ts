import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { Survey } from 'src/survey/survey.entity';
import { Option } from 'src/option/option.entity';
@Injectable()
export class QuestionService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
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
    }
  }

  async getAllQuestions(userId: string, surveyId: string): Promise<Question[]> {
    try {
      return await this.questionRepository.find({
        where: { survey: { s_id: surveyId, user: { u_id: userId } } },
      });
    } catch (error) {
      this.handleQueryError(`getAllQuestions`, 1, error);
    }
  }

  async deleteQuestion(questionId: string): Promise<any> {
    try {
      await this.optionRepository.delete({ question: { q_id: questionId } });
      await this.questionRepository.delete({ q_id: questionId });
      return [{ q_id: questionId }];
    } catch (error) {
      this.handleQueryError(`deleteQuestion`, 2, error);
    }
  }

  async updateQuestionText(
    userId: string,
    surveyId: string,
    questionId: string,
    newText: string,
  ): Promise<Question[]> {
    try {
      const question = await this.questionRepository.findOne({
        where: {
          q_id: questionId,
          survey: { s_id: surveyId, user: { u_id: userId } },
        },
      });

      if (!question) {
        throw new NotFoundException(
          `Question with id ${questionId} not found for user ${surveyId} or ${userId}`,
        );
      }

      question.text = newText;

      await this.questionRepository.save(question);

      return [question];
    } catch (error) {
      this.handleQueryError(`updateQuestionText`, 3, error);
    }
  }
}
