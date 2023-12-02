import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';
import { UserInput } from './user.input';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'getUser' })
  async getUser(@Args('email') email: string): Promise<User> {
    return this.userService.getUser(email);
  }

  @Mutation(() => User, { name: 'createUser' })
  async createUser(@Args('input') input: UserInput): Promise<User> {
    return this.userService.createUser(input);
  }
}
