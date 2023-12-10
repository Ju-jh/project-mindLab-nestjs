// answer.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './answer.entity';
import { Survey } from 'src/survey/survey.entity';
import { Question } from 'src/question/question.entity';
import { Option } from 'src/option/option.entity';
import { User } from 'src/user/user.entity';
import { AnswerInput } from './answer.input';

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

    await Promise.all(
      answers.map(async (answer) => {
        const { questionId, optionId, score } = answer;

        const existingAnswer = await this.answerRepository.findOne({
          where: {
            user: { u_id: userId },
            survey: { s_id: surveyId },
            question: { q_id: questionId },
          },
        });

        if (existingAnswer) {
          existingAnswer.option = await this.optionRepository.findOne({
            where: { o_id: optionId },
          });
          existingAnswer.score = score;
          await this.answerRepository.save(existingAnswer);
        } else {
          const question = await this.questionRepository.findOne({
            where: { q_id: questionId },
          });
          const option = await this.optionRepository.findOne({
            where: { o_id: optionId },
          });

          const newAnswer = new Answer();
          newAnswer.user = user;
          newAnswer.survey = survey;
          newAnswer.question = question;
          newAnswer.option = option;
          newAnswer.score = score;
          await this.answerRepository.save(newAnswer);
        }
      }),
    );
  }

  async getAnswers(surveyId: string, userId: string): Promise<Answer[]> {
    const answers = await this.answerRepository.find({
      where: {
        survey: { s_id: surveyId },
        user: { u_id: userId },
      },
      relations: ['question', 'option'],
    });

    console.log(answers);

    return answers;
  }
}
