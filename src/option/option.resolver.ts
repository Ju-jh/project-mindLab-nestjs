import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { OptionService } from './option.service';
import { UserService } from 'src/user/user.service';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Option } from './option.entity';

interface UserPayload extends JwtPayload {
  user: {
    email: string;
  };
}
@Resolver()
export class OptionResolver {
  constructor(
    private readonly optionService: OptionService,
    private readonly userService: UserService,
  ) {}
  async createOption(
    @Args('surveyId') surveyId: string,
    @Args('questionId') questionId: string,
    @Context('req') req,
  ): Promise<Option> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const createdSurvey = await this.optionService.createOption(
      userId,
      surveyId,
      questionId,
    );
    return createdSurvey;
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
