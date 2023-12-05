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
    console.log(req, '여기가 req');
    const cookieHeader = await req.headers.cookie;
    console.log(cookieHeader, '여기가 쿠키헤더');
    const userEmail = await this.extractEmailFromCookie(cookieHeader);
    console.log(userEmail, '여기가 userEmail');
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const createdSurvey = await this.surveyService.createSurvey(userId);
    return createdSurvey;
  }

  @Query(() => [Survey])
  async getMySurvey(): Promise<Survey[]> {
    const mySurveys = await this.surveyService.getMySurvey();
    return mySurveys;
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
          const userId = decodedToken.user.id;
          console.log(userId, '여기가 userId');
          return userId;
        }
      }
    }
  }
}
