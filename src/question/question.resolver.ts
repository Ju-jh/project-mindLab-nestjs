import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Question } from './question.entity';
import { UserService } from 'src/user/user.service';
import { QuestionService } from './question.service';
import { JwtPayload, verify } from 'jsonwebtoken';
import { postCreateQuestionrResponse } from './dto/post-create-question-dto';
import { postQuestionrResponse } from './dto/post-question-dto copy';

interface UserPayload extends JwtPayload {
  user: {
    email: string;
  };
}
@Resolver()
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => postCreateQuestionrResponse)
  async createQuestion(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<postCreateQuestionrResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const result = await this.questionService.createQuestion(userId, surveyId);
    try {
      result;
      return {
        success: true,
        message: '문제가 성공적으로 삭제되었습니다.',
        q_id: result.q_id,
      };
    } catch (error) {
      console.error('문제 삭제 실패:', error);
      return {
        success: false,
        message: '문제 삭제에 실패했습니다.',
        q_id: result.q_id,
      };
    }
  }

  @Query(() => [Question])
  async getAllQuestions(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<Question[]> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const getAllQustion = await this.questionService.getAllQuestions(
      userId,
      surveyId,
    );
    return getAllQustion;
  }

  @Mutation(() => [Question])
  async updateQuestionText(
    @Args('surveyId') surveyId: string,
    @Args('questionId') questionId: string,
    @Args('newText') newText: string,
    @Context('req') req,
  ): Promise<Question[]> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const getAllQuestion = await this.questionService.updateQuestionText(
      userId,
      surveyId,
      questionId,
      newText,
    );
    return getAllQuestion;
  }

  @Mutation(() => postQuestionrResponse)
  async deleteQuestion(
    @Args('surveyId') surveyId: string,
    @Args('questionId') questionId: string,
  ): Promise<postQuestionrResponse> {
    try {
      await this.questionService.deleteQuestion(questionId);
      return {
        success: true,
        message: '문제가 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      console.error('문제 삭제 실패:', error);
      return {
        success: false,
        message: '문제 삭제에 실패했습니다.',
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
