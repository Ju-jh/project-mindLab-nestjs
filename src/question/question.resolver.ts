import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Question } from './question.entity';
import { UserService } from 'src/user/user.service';
import { QuestionService } from './question.service';
import { JwtPayload, verify } from 'jsonwebtoken';

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

  @Mutation(() => Question)
  async createQuestion(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<Question> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const createdSurvey = await this.questionService.createQuestion(
      userId,
      surveyId,
    );
    return createdSurvey;
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
    const getAllQustion = await this.questionService.updateQuestionText(
      userId,
      surveyId,
      questionId,
      newText,
    );
    return getAllQustion;
  }

  @Mutation(() => [Question])
  async deleteQuestion(
    @Args('surveyId') surveyId: string,
    @Args('questionId') questionId: string,
    @Context('req') req,
  ): Promise<Question[]> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const getAllQustion = await this.questionService.deleteQuestion(
      userId,
      surveyId,
      questionId,
    );
    return getAllQustion;
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
