import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { OptionService } from './option.service';
import { UserService } from 'src/user/user.service';
import { JwtPayload, verify } from 'jsonwebtoken';
import { postOptionResponse } from './dto/post-option-dto';

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

  @Mutation(() => postOptionResponse)
  async createOption(
    @Args('surveyId') surveyId: string,
    @Args('questionId') questionId: string,
    @Context('req') req,
  ): Promise<postOptionResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    try {
      await this.optionService.createOption(userId, surveyId, questionId);
      return {
        success: true,
        message: '문항이 성공적으로 생성되었습니다.',
      };
    } catch (error) {
      console.error('문항 생성 실패:', error);
      return {
        success: false,
        message: '문항 생성에 실패했습니다.',
      };
    }
  }

  @Mutation(() => postOptionResponse)
  async updateOptionTextAndScore(
    @Args('optionId') optionId: string,
    @Args('newText') newText: string,
    @Args('newScore') newScore: number,
  ): Promise<postOptionResponse> {
    try {
      await this.optionService.updateOptionTextAndScore(
        optionId,
        newText,
        newScore,
      );
      return {
        success: true,
        message: '문항이 성공적으로 업데이트 되었습니다.',
      };
    } catch (error) {
      console.error('문항 업데이트 실패:', error);
      return {
        success: false,
        message: '문항 업데이트에 실패했습니다.',
      };
    }
  }

  @Mutation(() => postOptionResponse)
  async deleteOption(
    @Args('optionId') optionId: string,
  ): Promise<postOptionResponse> {
    try {
      await this.optionService.deleteOption(optionId);
      return {
        success: true,
        message: '문항이 성공적으로 삭제 되었습니다.',
      };
    } catch (error) {
      console.error('문항 삭제 실패:', error);
      return {
        success: false,
        message: '문항 삭제에 실패했습니다.',
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
