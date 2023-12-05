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
interface UserPayload extends JwtPayload {
  user: {
    email: string;
    photo: string;
  };
}

@Controller('user')
export class UserController {
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

  @Get('logout')
  async logout(@Res() res) {
    res.clearCookie('accessToken', { path: '/' });
    res.redirect('https://mind-lab-fe-55b3987890a9.herokuapp.com/');
  }
}
