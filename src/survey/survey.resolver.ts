import { Resolver, Mutation, Query, Context, Args } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

interface UserPayload extends JwtPayload {
  user: {
    email: string;
  };
}
@Resolver()
export class SurveyResolver {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Survey)
  async createSurvey(@Context('req') req): Promise<Survey> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const createdSurvey = await this.surveyService.createSurvey(userId);
    return createdSurvey;
  }

  @Query(() => [Survey])
  async getMySurvey(@Context('req') req): Promise<Survey[]> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const mySurveys = await this.surveyService.getMySurvey(userId);
    return mySurveys;
  }

  @Query(() => [Survey])
  async getAllSurvey(): Promise<Survey[]> {
    const mySurveys = await this.surveyService.getAllSurvey();
    return mySurveys;
  }

  @Mutation(() => Survey)
  async deleteSurvey(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<any> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const deleteSurvey = await this.surveyService.deleteSurvey(
      surveyId,
      userId,
    );
    return deleteSurvey;
  }

  @Query(() => [Survey])
  async getMyWhichSurvey(@Context('req') req): Promise<Survey[]> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const mySurveys = await this.surveyService.getMySurvey(userId);
    return mySurveys;
  }

  @Mutation(() => Survey)
  async updateMySurveyTitle(
    @Args('surveyId') surveyId: string,
    @Args('newTitle') newTitle: string,
    @Context('req') req,
  ): Promise<Survey> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const finSurveyUpdateTitle = await this.surveyService.updateSurveyTitle(
      userId,
      surveyId,
      newTitle,
    );
    return finSurveyUpdateTitle;
  }
  @Mutation(() => Survey)
  async getSurveyData(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<Survey> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const result = await this.surveyService.getSurveyData(userId, surveyId);
    return result;
  }

  @Mutation(() => Survey)
  async updateMySurveyDescription(
    @Args('surveyId') surveyId: string,
    @Args('newDescription') newDescription: string,
    @Context('req') req,
  ): Promise<Survey> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const finSurveyUpdateDescription =
      await this.surveyService.updateSurveyDescription(
        userId,
        surveyId,
        newDescription,
      );
    return finSurveyUpdateDescription;
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
