import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserInput } from './user.input';
import { UserService } from './user.service';
import { AuthCookie } from './user.AuthCookie';
import { getEmailAndPhotoDTO } from './dto/getEmailAndPhoto.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'getUser' })
  async getUser(@Args('email') email: string): Promise<User> {
    return this.userService.getUser(email);
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('input') input: UserInput): Promise<User> {
    return this.userService.findByEmailOrSave(input);
  }

  @Mutation((returns) => getEmailAndPhotoDTO)
  async getEmailPhotoByCookie(
    @AuthCookie() cookie: string,
    @Context('req') req: Request,
  ): Promise<getEmailAndPhotoDTO | null> {
    console.log(cookie, '여기가 cookie');
    return this.userService.getEmailAndPhotoByCookie(cookie);
  }
}
