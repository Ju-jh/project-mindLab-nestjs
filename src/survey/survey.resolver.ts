import { Resolver, Mutation, Query, Context, Args } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { getSurveysResponse } from './dto/get-surveys-dto';
import { postSurveyResponse } from './dto/post-survey-dto';
import { getSurveyResponse } from './dto/get-survey-dto';
import { getSurveyisPublicResponse } from './dto/get-survey-is-public-dto';

interface UserPayload extends JwtPayload {
  user: {
    email: string;
  };
}
@Resolver('Survey')
export class SurveyResolver {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => postSurveyResponse)
  async createSurvey(@Context('req') req): Promise<postSurveyResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    try {
      await this.surveyService.createSurvey(userId);
      return {
        success: true,
        message: '설문지가 성공적으로 생성되었습니다.',
      };
    } catch (error) {
      console.error('설문지 생성 실패:', error);
      return {
        success: false,
        message: '설문지 생성에 실패했습니다.',
      };
    }
  }

  @Query(() => getSurveysResponse)
  async getMySurvey(@Context('req') req): Promise<getSurveysResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const mySurveys = await this.surveyService.getMySurvey(userId);

    try {
      return {
        success: true,
        message: '나의 설문지 로드에 성공적으로 생성되었습니다.',
        surveys: mySurveys,
      };
    } catch (error) {
      console.error('나의 설문지 로드에 실패:', error);
      return {
        success: false,
        message: '나의 설문지 로드에 실패했습니다.',
        surveys: mySurveys,
      };
    }
  }

  @Query(() => getSurveysResponse)
  async getPublicSurvey(): Promise<getSurveysResponse> {
    const publicSurveys = await this.surveyService.getPublicSurvey();
    try {
      return {
        success: true,
        message: '공개된 설문지 로드에 성공적으로 생성되었습니다.',
        surveys: publicSurveys,
      };
    } catch (error) {
      console.error('공개된 설문지 로드에 실패:', error);
      return {
        success: false,
        message: '공개된 설문지 로드에 실패했습니다.',
        surveys: publicSurveys,
      };
    }
  }

  @Mutation(() => postSurveyResponse)
  async deleteSurvey(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<postSurveyResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    try {
      await this.surveyService.deleteSurvey(surveyId, userId);
      return {
        success: true,
        message: '나의설문지가 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      console.error('나의설문지 삭제 실패:', error);
      return {
        success: false,
        message: '나의설문지 삭제에 실패했습니다.',
      };
    }
  }

  @Mutation(() => getSurveyResponse)
  async getSurveyData(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<getSurveyResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const Survey = await this.surveyService.getSurveyData(userId, surveyId);
    try {
      return {
        success: true,
        message: '나의 설문지 데이터 로드에 성공적으로 생성되었습니다.',
        survey: Survey,
      };
    } catch (error) {
      console.error('나의 설문지 데이터 로드에 실패:', error);
      return {
        success: false,
        message: '나의 설문지 데이터 로드에 실패했습니다.',
        survey: Survey,
      };
    }
  }

  @Mutation(() => postSurveyResponse)
  async updateMySurveyTitle(
    @Args('surveyId') surveyId: string,
    @Args('newTitle') newTitle: string,
    @Context('req') req,
  ): Promise<postSurveyResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    await this.surveyService.updateSurveyTitle(userId, surveyId, newTitle);
    try {
      return {
        success: true,
        message: '나의 설문지의 제목이 성공적으로 수정되었습니다.',
      };
    } catch (error) {
      console.error('나의 설문지의 제목이 성공적으로 수정 실패:', error);
      return {
        success: false,
        message: '나의 설문지의 제목이 성공적으로 수정 실패했습니다.',
      };
    }
  }

  @Mutation(() => postSurveyResponse)
  async updateMySurveyDescription(
    @Args('surveyId') surveyId: string,
    @Args('newDescription') newDescription: string,
    @Context('req') req,
  ): Promise<postSurveyResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    try {
      await this.surveyService.updateSurveyDescription(
        userId,
        surveyId,
        newDescription,
      );
      return {
        success: true,
        message: '나의 설문지의 설명이 성공적으로 수정되었습니다.',
      };
    } catch (error) {
      console.error('나의 설문지의 설명이 성공적으로 수정 실패:', error);
      return {
        success: false,
        message: '나의 설문지의 설명이 성공적으로 수정 실패했습니다.',
      };
    }
  }

  @Mutation(() => postSurveyResponse)
  async updateMySurveyIsPublic(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<postSurveyResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const surveyToUpdate = await this.surveyService.findSurveyByIdAndUserId(
      surveyId,
      userId,
    );
    try {
      if (surveyToUpdate.public) {
        surveyToUpdate.public = false;
      } else {
        surveyToUpdate.public = true;
      }
      await this.surveyService.saveSurvey(surveyToUpdate);
      return {
        success: true,
        message: '나의 설문지가 성공적으로 Public(Private)되었습니다.',
      };
    } catch (error) {
      console.error('나의 설문지 Public(Private)에 실패:', error);
      return {
        success: false,
        message: '나의 설문지가 Public(Private)에 실패했습니다.',
      };
    }
  }

  @Mutation(() => getSurveyisPublicResponse)
  async checkMySurveyIsPublic(
    @Args('surveyId') surveyId: string,
    @Context('req') req,
  ): Promise<getSurveyisPublicResponse> {
    const cookieHeader = await req.headers.cookie;
    const userEmail = this.extractEmailFromCookie(cookieHeader);
    const userId = await this.userService.findUserIdByEmail(userEmail);
    const isSurveyPublic = await this.surveyService.findSurveyByIdAndUserId(
      surveyId,
      userId,
    );
    try {
      return {
        success: true,
        message: '나의 설문지의 Public(Private)여부가 확인 되었습니다.',
        public: isSurveyPublic.public,
      };
    } catch (error) {
      console.error('나의 설문지의 Public(Private)여부 확인에 실패:', error);
      return {
        success: false,
        message: '나의 설문지의 Public(Private)여부 확인에 실패했습니다.',
        public: isSurveyPublic.public,
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
