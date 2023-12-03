import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserInput } from './user.input';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { JwtPayload, verify, sign } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  user: {
    id: number;
    email: string;
  };
}
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Context('req') req, @Context('res') res) {
    const accessToken = this.generateAccessToken(req.user);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      path: '/',
    });
    res.redirect('https://mind-lab-fe-55b3987890a9.herokuapp.com/');
  }

  @Mutation()
  async getCookie(
    @Context('headers') headers: Record<string, string>,
    @Context('res') res,
  ): Promise<any> {
    const cookies = headers.cookie ? headers.cookie.split(';') : [];
    let isCookie = false;

    for (const cookie of cookies) {
      const [name] = cookie.trim().split('=');
      if (name === 'accessToken') {
        isCookie = true;
        break;
      }
    }

    res.json({ isCookie });
  }

  @Mutation()
  async userProfileGet(
    @Context('headers') headers: Record<string, string>,
    @Context('res') res,
  ): Promise<any> {
    const cookies = headers.cookie ? headers.cookie.split(';') : [];
    let accessToken = null;

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');

      if (name === 'accessToken') {
        accessToken = value;
        const decodedToken = verify(
          accessToken,
          process.env.ACCESS_TOKEN_PRIVATE_KEY,
        );
        res.json({ decodedToken });
      }
    }
  }

  @Query()
  async getUserApiKey(
    @Context('headers') headers: Record<string, string>,
    @Context('res') res,
  ): Promise<any> {
    const cookies = headers.cookie ? headers.cookie.split(';') : [];
    let accessToken = null;

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');

      if (name === 'accessToken') {
        accessToken = value;
        const decodedToken: UserPayload = verify(
          accessToken,
          process.env.ACCESS_TOKEN_PRIVATE_KEY,
        ) as UserPayload;
        if (decodedToken && decodedToken.user && decodedToken.user.email) {
          const email = await decodedToken.user.email;
          const user = await this.userService.getUser(email);
          res.json(user);
        }
      }
    }
  }

  @Query()
  async logout(@Context('res') res) {
    res.clearCookie('accessToken', { path: '/' });
    res.redirect('https://mind-lab-fe-55b3987890a9.herokuapp.com/');
  }

  private generateAccessToken(user: any): string {
    const secretKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const expiresIn = '24h';
    const accessToken = sign({ user }, secretKey, { expiresIn });
    return accessToken;
  }

  @Query(() => User, { name: 'getUser' })
  async getUser(@Args('email') email: string): Promise<User> {
    return this.userService.getUser(email);
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('input') input: UserInput): Promise<User> {
    return this.userService.findByEmailOrSave(input);
  }
}
