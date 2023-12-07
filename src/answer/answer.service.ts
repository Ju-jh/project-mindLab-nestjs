// answer.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';
import { AnswerInput } from './answer.input';
import { Survey } from 'src/survey/survey.entity';
import { Question } from 'src/question/question.entity';
import { Option } from 'src/option/option.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  async saveAnswers(
    surveyId: string,
    answers: AnswerInput[],
    userId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { u_id: userId } });
    const survey = await this.surveyRepository.findOne({
      where: { s_id: surveyId },
    });
    const answerEntities = await Promise.all(
      answers.map(async (answer) => {
        const question = await this.questionRepository.findOne({
          where: { q_id: answer.questionId },
        });
        const option = await this.optionRepository.findOne({
          where: { o_id: answer.optionId },
        });

        const answerEntity = new Answer();
        answerEntity.user = user;
        answerEntity.survey = survey;
        answerEntity.question = question;
        answerEntity.option = option;
        answerEntity.score = answer.score;
        return answerEntity;
      }),
    );

    await this.answerRepository.save(answerEntities);

    await this.answerRepository.save(answerEntities);
  }
}
