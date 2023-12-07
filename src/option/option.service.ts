import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from 'src/survey/survey.entity';
import { Option } from './option.entity';
import { Question } from 'src/question/question.entity';

@Injectable()
export class OptionService {
  private readonly logger = new Logger(OptionService.name);

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

  async createOption(
    userId: string,
    surveyId: string,
    questionId: string,
  ): Promise<any> {
    try {
      const survey = await this.surveyRepository.findOne({
        where: { s_id: surveyId },
        relations: ['questions'],
      });

      if (!survey) {
        throw new NotFoundException(`Survey with id ${surveyId} not found.`);
      }

      const question = survey.questions.find((q) => q.q_id === questionId);

      if (!question) {
        throw new NotFoundException(
          `Question with id ${questionId} not found.`,
        );
      }

      const newOption = this.optionRepository.create({
        survey: survey,
        question: question,
      });

      const savedOption = await this.optionRepository.save(newOption);

      return savedOption;
    } catch (error) {
      this.handleQueryError('createOption', 0, error);
      throw error;
    }
  }

  async updateOptionTextAndScore(
    optionId: string,
    newText: string,
    newScore: number,
  ): Promise<Option> {
    const option = await this.optionRepository.findOne({
      where: { o_id: optionId },
      relations: ['survey', 'question'],
    });

    if (!option) {
      throw new NotFoundException('Option not found');
    }

    option.text = newText;
    option.score = newScore;

    const updatedOption = await this.optionRepository.save(option);

    return updatedOption;
  }
}
