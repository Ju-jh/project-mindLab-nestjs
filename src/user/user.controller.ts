import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload, verify, sign } from 'jsonwebtoken';
import { UserService } from './user.service';
interface UserPayload extends JwtPayload {
  user: {
    photo: string;
    id: number;
    email: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = '24h';
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    try {
      const accessToken = this.generateAccessToken(req.user);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'None',
        secure: true,
      });
      res.redirect(process.env.FRONTEND_BASEURL);
    } catch (error) {
      console.error('Error in googleLoginCallback:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Post('cookie')
  async getCookie(@Headers('cookie') cookie: string, @Res() res): Promise<any> {
    console.log(cookie, '여기가 쿠키 찾아서 로그인');
    const cookies = cookie ? cookie.split(';') : [];
    let isCookie = false;

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      let accessToken = null;
      if (name === 'accessToken') {
        isCookie = true;
        accessToken = value;
        const decodedToken: UserPayload = verify(
          accessToken,
          process.env.ACCESS_TOKEN_PRIVATE_KEY,
        ) as UserPayload;
        if (decodedToken && decodedToken.user && decodedToken.user.email) {
          const email = decodedToken.user.email;
          const photo = decodedToken.user.photo || '/photo.png';
          return res.json({ isCookie, email, photo });
        }
      }
    }
  }

  @Get('emailphoto')
  async getEmailAndPhotoByCookie(
    @Headers('cookie') cookie: string,
    @Res() res,
  ): Promise<any> {
    console.log(cookie, '여기가 cookie');
    // const cookies = cookie.split(';');

    // let accessToken = null;

    // for (const cookie of cookies) {
    //   const [name, value] = cookie.trim().split('=');

    //   if (name === 'accessToken') {
    //     accessToken = value;
    //     const decodedToken: UserPayload = verify(
    //       accessToken,
    //       process.env.ACCESS_TOKEN_PRIVATE_KEY,
    //     ) as UserPayload;
    //     if (decodedToken && decodedToken.user && decodedToken.user.email) {
    //       const email = await decodedToken.user.email;
    //       const user = await this.userService.getUser(email);
    //       res.json(user);
    //     }
    //   }
    // }
  }

  @Get('logout')
  async logout(@Res() res) {
    res.clearCookie('accessToken', { path: '/' });
    res.redirect('https://mind-lab-fe-55b3987890a9.herokuapp.com/');
  }
}
