import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { sign } from 'jsonwebtoken';

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
    const accessToken = this.generateAccessToken(req.user);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
    });
    res.redirect('https://mind-lab-fe-55b3987890a9.herokuapp.com/');
  }
}
