import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { SaveAnswerResponse } from './dto/save-answer-dto';
import { UserService } from 'src/user/user.service';
import { JwtPayload, verify } from 'jsonwebtoken';
import { GetAnswerResponse } from './dto/get-answer-dto';
import { AnswerInput } from './answer.input';

interface UserPayload extends JwtPayload {
  user: {
    email: string;
  };
}
@Resolver()
export class AnswerResolver {
  constructor(
    private readonly answerService: AnswerService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => SaveAnswerResponse)
  async saveAnswers(
    @Args('surveyId') surveyId: string,
    @Args('answers', { type: () => [AnswerInput] })
    answers: AnswerInput[],
    @Context('req') req,
  ): Promise<SaveAnswerResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    try {
      await this.answerService.saveAnswers(surveyId, answers, userId);
      return {
        success: true,
        message: '답변이 성공적으로 저장되었습니다.',
      };
    } catch (error) {
      console.error('답변 저장 실패:', error);
      return {
        success: false,
        message: '답변 저장에 실패했습니다.',
      };
    }
  }

  @Mutation(() => GetAnswerResponse)
  async getAnswers(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<GetAnswerResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const Answers = await this.answerService.getAnswers(surveyId, userId);
    console.log(Answers);
    try {
      return {
        success: true,
        message: '전체 답변이 성공적으로 로드되었습니다.',
        answers: Answers,
      };
    } catch (error) {
      console.error('답변 전체 로드 실패:', error);
      return {
        success: false,
        message: '전체 답변을 로드하는데 실패했습니다.',
        answers: Answers,
      };
    }
  }

  private extractEmailFromCookie(cookieHeader: string): string | null {
    const cookies = cookieHeader ? cookieHeader.split(';') : [];
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      let accessToken = null;
      if (name === 'accessToken') {
        accessToken = value;
        const decodedToken: UserPayload = verify(
          accessToken,
          process.env.ACCESS_TOKEN_PRIVATE_KEY,
        ) as UserPayload;
        if (decodedToken && decodedToken.user && decodedToken.user.email) {
          const userEmail = decodedToken.user.email;
          return userEmail;
        }
      }
    }
  }
}
