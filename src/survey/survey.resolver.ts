import { Resolver, Mutation, Query, Context } from '@nestjs/graphql';
import { Survey } from './survey.entity';
import { SurveyService } from './survey.service';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

interface UserPayload extends JwtPayload {
  user: {
    id: string;
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
    const userEmail = this.extractEmailFromCookie(req);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const createdSurvey = await this.surveyService.createSurvey(userId);
    return createdSurvey;
  }

  @Query(() => [Survey])
  async getMySurvey(): Promise<Survey[]> {
    const mySurveys = await this.surveyService.getMySurvey();
    return mySurveys;
  }

  private extractEmailFromCookie(req): string | null {
    const cookie = req.cookies;
    const cookies = cookie ? cookie.split(';') : [];
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
          const userId = decodedToken.user.id;
          console.log(userId, '여기가 userId');
          return userId;
        }
      }
    }
  }
}
