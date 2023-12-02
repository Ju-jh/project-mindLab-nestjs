import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInput } from './user.input';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private handleQueryError(
    methodName: string,
    id: number,
    error: Error,
  ): never {
    this.logger.error(`Error in ${methodName}: ${error.message}`);
    throw new Error(
      `Failed to fetch ${methodName.toLowerCase()} with id ${id}`,
    );
  }

  async createUser(data: UserInput): Promise<User> {
    try {
      const user = this.userRepository.create(data as Partial<User>);
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleQueryError('createUser', data['id'], error);
    }
  }

  async getUser(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!email) {
        throw new NotFoundException(`Survey with id ${email} not found`);
      }
      return user;
    } catch (error) {
      this.handleQueryError('getUser', 0, error);
    }
  }
}
